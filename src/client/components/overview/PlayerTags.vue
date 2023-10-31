<template>
    <div class="player-tags">
        <div class="player-tags-main">
            <tag-count :tag="'vp'" :count="player.victoryPointsBreakdown.total" :size="'big'" :type="'main'" :hideCount="hideVpCount" />
            <div v-if="isEscapeVelocityOn" class="tag-display" :class="tooltipCss" :data-tooltip="$t('Escape Velocity penalty')">
              <tag-count :tag="'escape'" :count="escapeVelocityPenalty" :size="'big'" :type="'main'"/>
            </div>
            <tag-count :tag="'tr'" :count="player.terraformRating" :size="'big'" :type="'main'"/>
            <div class="tag-and-discount">
              <PlayerTagDiscount v-if="all.discount" :amount="all.discount" :color="player.color"  :data-test="'discount-all'"/>
              <tag-count :tag="'cards'" :count="cardsInHandCount" :size="'big'" :type="'main'"/>
            </div>
        </div>
        <div class="player-tags-secondary">
          <div class="tag-count-container" v-for="tagDetail of tags" :key="tagDetail.name">
            <div class="tag-and-discount" v-if="tagDetail.name !== 'separator'">
              <PlayerTagDiscount v-if="tagDetail.discount > 0" :color="player.color" :amount="tagDetail.discount" :data-test="'discount-' + tagDetail.name"/>
              <PointsPerTag :points="tagDetail"/>
              <tag-count :tag="tagDetail.name" :count="tagDetail.count" :size="'big'" :type="'secondary'"/>
            </div>
            <div v-else-if="tagDetail.name === 'separator'" class="tag-separator"></div>
          </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import TagCount from '@/client/components/TagCount.vue';
import {ViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {GameModel} from '@/common/models/GameModel';
import {Tag} from '@/common/cards/Tag';
import {SpecialTags} from '@/client/cards/SpecialTags';
import PlayerTagDiscount from '@/client/components/overview/PlayerTagDiscount.vue';
import PointsPerTag from '@/client/components/overview/PointsPerTag.vue';
import {PartyName} from '@/common/turmoil/PartyName';
import {getCard} from '@/client/cards/ClientCardManifest';
import {vueRoot} from '@/client/components/vueRoot';
import {CardName} from '@/common/cards/CardName';

type InterfaceTagsType = Tag | SpecialTags | 'all' | 'separator';
type TagDetail = {
  name: InterfaceTagsType;
  discount: number;
  points: number;
  halfPoints: number;
  count: number;
};

const ORDER: Array<InterfaceTagsType> = [
  Tag.BUILDING,
  Tag.SPACE,
  Tag.SCIENCE,
  Tag.POWER,
  Tag.EARTH,
  Tag.JOVIAN,
  Tag.VENUS,
  Tag.PLANT,
  Tag.MICROBE,
  Tag.ANIMAL,
  Tag.CITY,
  Tag.MOON,
  Tag.MARS,
  'separator',
  Tag.EVENT,
  SpecialTags.NONE,
  Tag.WILD,
  SpecialTags.INFLUENCE,
  SpecialTags.CITY_COUNT,
  SpecialTags.COLONY_COUNT,
  SpecialTags.EXCAVATIONS,
  SpecialTags.CORRUPTION,
];

const isInGame = (tag: InterfaceTagsType, game: GameModel): boolean => {
  const gameOptions = game.gameOptions;
  if (game.turmoil === undefined && tag === SpecialTags.INFLUENCE) return false;
  if (gameOptions.pathfindersExpansion === false && tag === Tag.MARS) return false;
  switch (tag) {
  case SpecialTags.COLONY_COUNT:
    return gameOptions.coloniesExtension !== false;
  case SpecialTags.INFLUENCE:
    return game.turmoil !== undefined;
  case SpecialTags.EXCAVATIONS:
  case SpecialTags.CORRUPTION:
    return gameOptions.underworldExpansion !== false;
  case Tag.VENUS:
    return game.gameOptions.venusNextExtension !== false;
  case Tag.MOON:
    return game.gameOptions.moonExpansion !== false;
  case Tag.MARS:
    return (gameOptions.pathfindersExpansion || gameOptions.underworldExpansion);
  }
  return true;
};

const getTagCount = (tagName: InterfaceTagsType, player: PublicPlayerModel): number => {
  switch (tagName) {
  case SpecialTags.COLONY_COUNT:
    return player.coloniesCount || 0;
  case SpecialTags.INFLUENCE:
    return player.influence || 0;
  case SpecialTags.CITY_COUNT:
    return player.citiesCount || 0;
  case SpecialTags.NONE:
    return player.noTagsCount || 0;
  case SpecialTags.EXCAVATIONS:
    return player.excavations;
  case SpecialTags.CORRUPTION:
    return player.corruption;
  }
  return player.tags.find((tag) => tag.tag === tagName)?.count ?? 0;
};

export default Vue.extend({
  name: 'PlayerTags',
  props: {
    playerView: {
      type: Object as () => ViewModel,
    },
    player: {
      type: Object as () => PublicPlayerModel,
    },
    hideZeroTags: {
      type: Boolean,
    },
    isTopBar: {
      type: Boolean,
      default: false,
    },
    conciseTagsViewDefaultValue: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    type TagDetails = Record<InterfaceTagsType, TagDetail>;

    // Start by giving every entry a default value
    // Ideally, remove 'x' and inline it into Object.fromEntries, but Typescript doesn't like it.
    const x = ORDER.map((key) => [key, {name: key, discount: 0, points: 0, count: getTagCount(key, this.player), halfPoints: 0}]);
    const details: TagDetails = Object.fromEntries(x);

    // Initialize all's card discount.
    details['all'] = {name: 'all', discount: this.player?.cardDiscount ?? 0, points: 0, count: 0, halfPoints: 0};

    // For each card
    for (const card of this.player.tableau) {
      // Calculate discount
      for (const discount of card.discount ?? []) {
        const tag = discount.tag ?? 'all';
        details[tag].discount += discount.amount;
      }

      // Special case Cultivation of Venus & Venera Base.
      // See https://github.com/terraforming-mars/terraforming-mars/issues/5236
      if (card.name === CardName.CULTIVATION_OF_VENUS || card.name === CardName.VENERA_BASE) {
        details[Tag.VENUS].halfPoints ++;
      } else {
        const vps = getCard(card.name)?.victoryPoints;
        if (vps !== undefined && typeof(vps) !== 'number' && vps !== 'special' && vps.tag !== undefined) {
          details[vps.tag].points += ((vps.each ?? 1) / (vps.per ?? 1));
        }
      }
    }

    // Other modifiers
    if (this.playerView.game.turmoil?.ruling === PartyName.UNITY &&
      this.playerView.game.turmoil.politicalAgendas?.unity.policyId === 'up04') {
      details[Tag.SPACE].discount += 2;
    }

    // Put them in order.
    const tagsInOrder: Array<TagDetail> = [];
    for (const tag of ORDER) {
      const entry = details[tag];
      tagsInOrder.push(entry);
    }

    return {
      all: details['all'],
      tagsInOrder,
    };
  },

  components: {
    'tag-count': TagCount,
    PlayerTagDiscount,
    PointsPerTag,
  },
  computed: {
    isThisPlayer(): boolean {
      return this.player.color === this.playerView.thisPlayer?.color;
    },
    cardsInHandCount(): number {
      return this.player.cardsInHandNbr ?? 0;
    },
    hideVpCount(): boolean {
      return !this.playerView.game.gameOptions.showOtherPlayersVP && !this.isThisPlayer;
    },
    isEscapeVelocityOn(): boolean {
      return this.playerView.game.gameOptions.escapeVelocityMode;
    },
    escapeVelocityPenalty(): number {
      return this.player.victoryPointsBreakdown.escapeVelocity;
    },
    tooltipCss(): string {
      return 'tooltip tooltip-' + (this.isTopBar ? 'bottom' : 'top');
    },
    tags(): Array<TagDetail> {
      // In tests this one call to vueRoot uses `?.` because for some reason it this doesn't pass tests.
      const concise = vueRoot(this).componentsVisibility?.['tags_concise'] ?? this.conciseTagsViewDefaultValue;
      return this.tagsInOrder.filter((entry) => {
        if (!isInGame(entry.name, this.playerView.game)) {
          return false;
        }

        if (entry.count === 0 && entry.discount === 0) {
          if (this.hideZeroTags || concise) {
            return false;
          }
        }
        return true;
      });
    },
  },
});

</script>
