<template>
        <div class="player-tags">
            <div class="player-tags-main">
                <tag-count :tag="'vp'" :count="player.victoryPointsBreakdown.total" :size="'big'" :type="'main'" :hideCount="hideVpCount" />
                <div v-if="isEscapeVelocityOn" class="tag-display" :class="tooltipCss" data-tooltip="Escape Velocity penalty">
                  <tag-count :tag="'escape'" :count="escapeVelocityPenalty" :size="'big'" :type="'main'"/>
                </div>
                <tag-count :tag="'tr'" :count="player.terraformRating" :size="'big'" :type="'main'"/>
                <div class="tag-and-discount">
                  <PlayerTagDiscount v-if="all.discount" :amount="all.discount" :color="player.color"  :data-test="'discount-all'"/>
                  <tag-count :tag="'cards'" :count="cardsInHandCount" :size="'big'" :type="'main'"/>
                </div>
            </div>
            <div class="player-tags-secondary">
              <div class="tag-count-container" v-for="tagDetail of tags()" :key="tagDetail.name">
                <div class="tag-and-discount" v-if="tagDetail.name !== 'separator'">
                  <PlayerTagDiscount v-if="tagDetail.discount > 0" :color="player.color" :amount="tagDetail.discount" :data-test="'discount-' + tagDetail.name"/>
                  <PointsPerTag v-if="getVPs(tagDetail) !== ''" :amount="getVPs(tagDetail)" :data-test="'vps-' + tagDetail.name" />
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
import {ITagCount} from '@/common/cards/ITagCount';
import {ViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {GameModel} from '@/common/models/GameModel';
import {Tags} from '@/common/cards/Tags';
import {SpecialTags} from '@/client/cards/SpecialTags';
import PlayerTagDiscount from '@/client/components/overview/PlayerTagDiscount.vue';
import PointsPerTag from '@/client/components/overview/PointsPerTag.vue';
import {PartyName} from '@/common/turmoil/PartyName';
import {Shared} from '@/client/components/overview/Shared';
import {getCard} from '@/client/cards/ClientCardManifest';

type InterfaceTagsType = Tags | SpecialTags | 'all' | 'separator';
type TagDetail = {
  name: InterfaceTagsType;
  discount: number;
  points: number;
  count: number;
};

const ORDER: Array<InterfaceTagsType> = [
  Tags.BUILDING,
  Tags.SPACE,
  Tags.SCIENCE,
  Tags.ENERGY,
  Tags.EARTH,
  Tags.JOVIAN,
  Tags.VENUS,
  Tags.PLANT,
  Tags.MICROBE,
  Tags.ANIMAL,
  Tags.CITY,
  Tags.MOON,
  Tags.MARS,
  'separator',
  Tags.EVENT,
  SpecialTags.NONE,
  Tags.WILD,
  SpecialTags.INFLUENCE,
  SpecialTags.CITY_COUNT,
  SpecialTags.COLONY_COUNT,
];

const isInGame = (tag: InterfaceTagsType, game: GameModel): boolean => {
  if (game.gameOptions.coloniesExtension === false && tag === SpecialTags.COLONY_COUNT) return false;
  if (game.turmoil === undefined && tag === SpecialTags.INFLUENCE) return false;
  if (game.gameOptions.venusNextExtension === false && tag === Tags.VENUS) return false;
  if (game.gameOptions.moonExpansion === false && tag === Tags.MOON) return false;
  if (game.gameOptions.pathfindersExpansion === false && tag === Tags.MARS) return false;
  return true;
};

const getTagCount = (tagName: InterfaceTagsType, player: PublicPlayerModel): number => {
  if (tagName === SpecialTags.COLONY_COUNT) {
    return player.coloniesCount || 0;
  }
  if (tagName === SpecialTags.INFLUENCE) {
    return player.influence || 0;
  }
  if (tagName === SpecialTags.CITY_COUNT) {
    return player.citiesCount || 0;
  }
  if (tagName === SpecialTags.NONE) {
    return player.noTagsCount || 0;
  }

  return player.tags.find((tag: ITagCount) => tag.tag === tagName)?.count ?? 0;
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
    const x = ORDER.map((key) => [key, {name: key, discount: 0, points: 0, count: getTagCount(key, this.player)}]);
    const details: TagDetails = Object.fromEntries(x);

    // Initialize all's card discount.
    details['all'] = {name: 'all', discount: this.player?.cardDiscount ?? 0, points: 0, count: 0};

    const cards = this.player.corporationCard !== undefined ?
      [...this.player.playedCards, this.player.corporationCard] :
      this.player.playedCards;

    // For each card
    for (const card of cards) {
      // Calculate discount
      for (const discount of card.discount ?? []) {
        const tag = discount.tag ?? 'all';
        details[tag].discount += discount.amount;
      }

      const vps = getCard(card.name)?.victoryPoints;
      if (vps !== undefined && typeof(vps) !== 'number' && vps !== 'special' && vps.type !== 'resource') {
        details[vps.type].points += (vps.points / vps.per);
      }
    }

    // Other modifiers
    if (this.playerView.game.turmoil?.ruling === PartyName.UNITY &&
      this.playerView.game.turmoil.politicalAgendas?.unity.policyId === 'up04') {
      details[Tags.SPACE].discount += 2;
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
  },

  methods: {
    getVPs(detail: TagDetail) {
      const integer = Math.floor(detail.points);
      const fraction = detail.points - integer;
      let vulgarFraction = '';
      if (fraction === 0.5) {
        vulgarFraction = '½';
      } else if (Math.abs(fraction - (1/3)) < Number.EPSILON) {
        vulgarFraction = '⅓';
      }
      return `${integer || ''}${vulgarFraction}`;
    },
    tags(): Array<TagDetail> {
      return this.tagsInOrder.filter((entry) => {
        if (!isInGame(entry.name, this.playerView.game)) return false;
        if (entry.count === 0) {
          if (this.hideZeroTags) return false;
          if (Shared.isTagsViewConcise(this.$root) ?? this.conciseTagsViewDefaultValue) return false;
        }
        return true;
      });
    },
  },
});

</script>
