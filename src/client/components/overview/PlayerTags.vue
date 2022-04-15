<template>
        <div class="player-tags">
            <div class="player-tags-main">
                <tag-count :tag="'vp'" :count="player.victoryPointsBreakdown.total" :size="'big'" :type="'main'" :hideCount="hideVpCount" />
                <div v-if="isEscapeVelocityOn" class="tag-display tooltip tooltip-top" data-tooltip="Escape Velocity penalty">
                  <tag-count :tag="'escape'" :count="escapeVelocityPenalty" :size="'big'" :type="'main'"/>
                </div>
                <tag-count :tag="'tr'" :count="player.terraformRating" :size="'big'" :type="'main'"/>
                <div class="tag-and-discount">
                  <PlayerTagDiscount v-if="getTagDiscountAmount('all') > 0" :amount="getTagDiscountAmount('all')" :color="player.color"  :data-test="'discount-all'"/>
                  <tag-count :tag="'cards'" :count="cardsInHandCount" :size="'big'" :type="'main'"/>
                </div>
            </div>
            <div class="player-tags-secondary">
                <template v-if="showShortTags">
                  <div class="tag-count-container" v-for="tag in player.tags" :key="tag.tag">
                    <div class="tag-and-discount">
                      <PlayerTagDiscount v-if="getTagDiscountAmount(tag.tag) > 0" :amount="getTagDiscountAmount(tag.tag)" :color="player.color" />
                      <PointsPerTag v-if="getVPs(tag.tag) !== ''" :amount="getVPs(tag.tag)" />
                      <tag-count :tag="tag.tag" :count="tag.count" :size="'big'" :type="'secondary'"/>
                    </div>
                  </div>
                </template>
                <template v-else>
                    <div class="tag-count-container" v-for="tagName in tagsPlaceholders" :key="tagName">
                      <div class="tag-and-discount" v-if="tagName !== 'separator'">
                        <PlayerTagDiscount v-if="getTagDiscountAmount(tagName) > 0" :color="player.color" :amount="getTagDiscountAmount(tagName)" :data-test="'discount-' + tagName"/>
                        <PointsPerTag v-if="getVPs(tagName) !== ''" :amount="getVPs(tagName)" :data-test="'vps-' + tagName" />
                        <tag-count :tag="tagName" :count="getTagCount(tagName)" :size="'big'" :type="'secondary'"/>
                      </div>
                      <div v-else class="tag-separator"></div>
                    </div>
                </template>
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

export const PLAYER_INTERFACE_TAGS_ORDER: Array<InterfaceTagsType> = [
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
  Tags.WILDCARD,
  SpecialTags.INFLUENCE,
  SpecialTags.CITY_COUNT,
  SpecialTags.COLONY_COUNT,
];

const isTagInGame = (tag: InterfaceTagsType, game: GameModel) => {
  if (game.gameOptions.coloniesExtension === false && tag === SpecialTags.COLONY_COUNT) return false;
  if (game.turmoil === undefined && tag === SpecialTags.INFLUENCE) return false;
  if (game.gameOptions.venusNextExtension === false && tag === Tags.VENUS) return false;
  if (game.gameOptions.moonExpansion === false && tag === Tags.MOON) return false;
  if (game.gameOptions.pathfindersExpansion === false && tag === Tags.MARS) return false;
  return true;
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
  },
  data() {
    type TagModifier = {
      discount: number;
      points: number;
    };
    type TagModifiers = Record<InterfaceTagsType, TagModifier>;

    const x = PLAYER_INTERFACE_TAGS_ORDER.map((key) => [key, {discount: 0, points: 0}]);
    const modifiers: TagModifiers = Object.fromEntries(x);
    modifiers['all'] = {discount: this.player?.cardDiscount ?? 0, points: 0};

    const cards = this.player.corporationCard !== undefined ?
      [...this.player.playedCards, this.player.corporationCard] :
      this.player.playedCards;

    for (const card of cards) {
      for (const discount of card.discount ?? []) {
        const tag = discount.tag ?? 'all';
        modifiers[tag].discount += discount.amount;
      }

      const vps = getCard(card.name)?.victoryPoints;
      if (vps !== undefined && typeof(vps) !== 'number' && vps !== 'special' && vps.type !== 'resource') {
        modifiers[vps.type].points += (vps.points / vps.per);
      }
    }

    if (this.playerView.game.turmoil?.ruling === PartyName.UNITY &&
      this.playerView.game.turmoil.politicalAgendas?.unity.policyId === 'up04') {
      modifiers[Tags.SPACE].discount += 2;
    }
    return {
      modifiers,
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
    showColonyCount(): boolean {
      return this.playerView.game.gameOptions.coloniesExtension;
    },
    showInfluence(): boolean {
      return this.playerView.game.turmoil !== undefined;
    },
    tagsPlaceholders(): Array<InterfaceTagsType> {
      const tags = PLAYER_INTERFACE_TAGS_ORDER;
      return tags.filter((tag) => {
        return isTagInGame(tag, this.playerView.game);
      });
    },
    cardsInHandCount(): number {
      if (this.player.cardsInHandNbr) {
        return this.player.cardsInHandNbr;
      }
      return 0;
    },
    hideVpCount(): boolean {
      return !this.playerView.game.gameOptions.showOtherPlayersVP && !this.isThisPlayer;
    },
    showShortTags(): boolean {
      if (this.hideZeroTags === true) return true;
      return Shared.isTagsViewConcise(this.$root);
    },
    isEscapeVelocityOn: function(): boolean {
      return this.playerView.game.gameOptions.escapeVelocityMode;
    },
    escapeVelocityPenalty: function(): number {
      return this.player.victoryPointsBreakdown.escapeVelocity;
    },
  },

  methods: {
    getTagDiscountAmount(tag: InterfaceTagsType): number {
      return this.modifiers[tag].discount;
    },
    getVPs(tag: InterfaceTagsType) {
      const modifier = this.modifiers[tag];
      const integer = Math.floor(modifier.points);
      const fraction = modifier.points - integer;
      let vulgarFraction = '';
      if (fraction === 0.5) {
        vulgarFraction = '½';
      } else if (Math.abs(fraction - (1/3)) < Number.EPSILON) {
        vulgarFraction = '⅓';
      }
      return `${integer || ''}${vulgarFraction}`;
    },
    getTagCount(tagName: InterfaceTagsType): number {
      if (tagName === SpecialTags.COLONY_COUNT && this.showColonyCount) {
        return this.player.coloniesCount || 0;
      }
      if (tagName === SpecialTags.INFLUENCE && this.showInfluence) {
        return this.player.influence || 0;
      }
      if (tagName === SpecialTags.CITY_COUNT) {
        return this.player.citiesCount || 0;
      }
      if (tagName === SpecialTags.NONE) {
        return this.player.noTagsCount || 0;
      }
      const basicTagFound = this.player.tags.find(
        (tag: ITagCount) => tag.tag === tagName,
      );

      if (basicTagFound !== undefined) {
        return basicTagFound.count;
      }

      return 0;
    },
  },
});

</script>
