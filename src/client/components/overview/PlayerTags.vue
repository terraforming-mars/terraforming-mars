<template>
        <div class="player-tags">
            <div class="player-tags-main">
                <tag-count :tag="'vp'" :count="getVpCount()" :size="'big'" :type="'main'" :hideCount="hideVpCount()" />
                <div v-if="isEscapeVelocityOn()" class="tag-display tooltip tooltip-top" data-tooltip="Escape Velocity penalty">
                  <tag-count :tag="'escape'" :count="getEscapeVelocityPenalty()" :size="'big'" :type="'main'"/>
                </div>
                <tag-count :tag="'tr'" :count="getTR()" :size="'big'" :type="'main'"/>
                <div class="tag-and-discount">
                  <PlayerTagDiscount v-if="hasTagDiscount('all')" :amount="getTagDiscountAmount('all')" :color="player.color" />
                  <tag-count :tag="'cards'" :count="getCardCount()" :size="'big'" :type="'main'"/>
                </div>
            </div>
            <div class="player-tags-secondary">
                <template v-if="showShortTags()">
                  <div class="tag-count-container" v-for="tag in player.tags" :key="tag.tag">
                    <div class="tag-and-discount">
                      <PlayerTagDiscount v-if="hasTagDiscount(tag.tag)" :amount="getTagDiscountAmount(tag.tag)" :color="player.color" />
                      <JovianMultiplier v-if="showJovianMultipliers(tag.tag)" :amount="playerJovianMultipliersCount()" />
                      <tag-count :tag="tag.tag" :count="tag.count" :size="'big'" :type="'secondary'"/>
                    </div>
                  </div>
                </template>
                <template v-else>
                    <div class="tag-count-container" v-for="tagName in getTagsPlaceholders()" :key="tagName">
                      <div class="tag-and-discount" v-if="tagName !== 'separator'">
                        <PlayerTagDiscount v-if="hasTagDiscount(tagName)" :color="player.color" :amount="getTagDiscountAmount(tagName)"/>
                        <JovianMultiplier v-if="showJovianMultipliers(tagName)" :amount="playerJovianMultipliersCount()" />
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
import {ITagCount} from '@/ITagCount';
import {ViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import {GameModel} from '@/models/GameModel';
import {Tags} from '@/cards/Tags';
import {CardName} from '@/CardName';
import {SpecialTags} from '@/cards/SpecialTags';
import PlayerTagDiscount from '@/client/components/overview/PlayerTagDiscount.vue';
import JovianMultiplier from '@/client/components/overview/JovianMultiplier.vue';
import {PartyName} from '@/turmoil/parties/PartyName';
import {CardModel} from '@/models/CardModel';
import {Shared} from '@/client/components/overview/Shared';

type InterfaceTagsType = Tags | SpecialTags | 'all' | 'separator';

const JOVIAN_MULTIPLIERS: Array<CardName> = [
  CardName.IO_MINING_INDUSTRIES,
  CardName.GANYMEDE_COLONY,
  CardName.WATER_IMPORT_FROM_EUROPA,
];

const hasDiscount = (tag: InterfaceTagsType, card: CardModel): boolean => {
  if (tag === SpecialTags.COLONY_COUNT || tag === SpecialTags.CITY_COUNT) return false;
  if (card.discount === undefined) {
    return false;
  }
  if (tag === 'all') {
    return card.discount.tag === undefined;
  }
  return card.discount.tag === tag;
};

const getDiscountAmount = (tag: InterfaceTagsType, card: CardModel): number => {
  if (hasDiscount(tag, card)) {
    return card?.discount?.amount || 0;
  }
  return 0;
};

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
  if (game.gameOptions.coloniesExtension === false && tag === SpecialTags.COLONY_COUNT) {
    return false;
  }
  if (game.turmoil === undefined && tag === SpecialTags.INFLUENCE) {
    return false;
  }
  if (game.gameOptions.venusNextExtension === false && tag === Tags.VENUS) {
    return false;
  }
  if (game.gameOptions.moonExpansion === false && tag === Tags.MOON) {
    return false;
  }
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
  components: {
    'tag-count': TagCount,
    PlayerTagDiscount,
    JovianMultiplier,
  },
  computed: {
    isThisPlayer(): boolean {
      return this.player.color === this.playerView.thisPlayer?.color;
    },
  },

  methods: {
    showColonyCount(): boolean {
      return this.playerView.game.gameOptions.coloniesExtension;
    },
    showInfluence(): boolean {
      return this.playerView.game.turmoil !== undefined;
    },
    showVenus(): boolean {
      return this.playerView.game.gameOptions.venusNextExtension;
    },
    showMoon(): boolean {
      return this.playerView.game.gameOptions.moonExpansion;
    },
    getTagsPlaceholders(): Array<InterfaceTagsType> {
      const tags = PLAYER_INTERFACE_TAGS_ORDER;
      return tags.filter((tag) => {
        return isTagInGame(tag, this.playerView.game);
      });
    },
    getCardCount(): number {
      if (this.player.cardsInHandNbr) {
        return this.player.cardsInHandNbr;
      }
      return 0;
    },
    getTR(): number {
      return this.player.terraformRating;
    },
    getVpCount(): number {
      return this.player.victoryPointsBreakdown.total;
    },
    hideVpCount(): boolean {
      return !this.playerView.game.gameOptions.showOtherPlayersVP && !this.isThisPlayer;
    },
    showShortTags(): boolean {
      if (this.hideZeroTags === true) return true;
      return Shared.isTagsViewConcise(this.$root);
    },
    hasTagDiscount(tag: InterfaceTagsType): boolean {
      for (const card of [...this.player.playedCards, this.player.corporationCard]) {
        if (card !== undefined) {
          if (hasDiscount(tag, card)) {
            return true;
          }
        }
      }

      const turmoil = this.playerView.game.turmoil;
      if (tag === Tags.SPACE &&
        turmoil && turmoil.ruling === PartyName.UNITY &&
        turmoil.politicalAgendas?.unity.policyId === 'up04') {
        return true;
      }

      if (tag === 'all' && (this.playerView.thisPlayer?.cardDiscount ?? 0) > 0) {
        return true;
      }

      return false;
    },
    getTagDiscountAmount(tag: InterfaceTagsType): number {
      let discount = 0;
      for (const card of [...this.player.playedCards, this.player.corporationCard]) {
        if (card !== undefined) {
          discount += getDiscountAmount(tag, card);
        }
      }

      if (tag === Tags.SPACE && this.playerView.game.turmoil?.ruling === PartyName.UNITY) {
        if (this.playerView.game.turmoil.politicalAgendas?.unity.policyId === 'up04') discount += 2;
      }

      if (tag === 'all') {
        discount += this.playerView.thisPlayer?.cardDiscount ?? 0;
      }

      return discount;
    },
    getTagCount(tagName: InterfaceTagsType): number {
      if (tagName === SpecialTags.COLONY_COUNT && this.showColonyCount()) {
        return this.player.coloniesCount || 0;
      }
      if (tagName === SpecialTags.INFLUENCE && this.showInfluence()) {
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
    showJovianMultipliers(tag: InterfaceTagsType): boolean {
      return tag === Tags.JOVIAN && this.playerJovianMultipliersCount() > 0;
    },
    playerJovianMultipliersCount(): number {
      let multipliers = 0;
      for (const card of this.player.playedCards) {
        if (card !== undefined && JOVIAN_MULTIPLIERS.includes(card.name as CardName)) {
          multipliers += 1;
        }
      }
      return multipliers;
    },
    isEscapeVelocityOn: function(): boolean {
      return this.playerView.game.gameOptions.escapeVelocityMode;
    },
    getEscapeVelocityPenalty: function(): number {
      return this.player.victoryPointsBreakdown.escapeVelocity;
    },
  },
});

</script>
