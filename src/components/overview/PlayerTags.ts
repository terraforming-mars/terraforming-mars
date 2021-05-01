import Vue from 'vue';
import {TagCount} from '../TagCount';
import {ITagCount} from '../../ITagCount';
import {PlayerModel} from '../../models/PlayerModel';
import {Tags} from '../../cards/Tags';
import {CardName} from '../../CardName';
import {SpecialTags} from '../../cards/SpecialTags';
import {isTagsViewConcise} from './OverviewSettings';
import {PlayerTagDiscount} from './PlayerTagDiscount';
import {JovianMultiplier} from './JovianMultiplier';
import {PartyName} from '../../turmoil/parties/PartyName';
import {TurmoilPolicy} from '../../turmoil/TurmoilPolicy';
import {ColonyName} from '../../colonies/ColonyName';
import {CardModel} from '../../models/CardModel';

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
  'separator',
  Tags.EVENT,
  SpecialTags.NONE,
  Tags.WILDCARD,
  SpecialTags.INFLUENCE,
  SpecialTags.CITY_COUNT,
  SpecialTags.COLONY_COUNT,
];

export const checkTagUsed = (tag: InterfaceTagsType, player: PlayerModel) => {
  if (player.game.gameOptions.coloniesExtension === false && tag === SpecialTags.COLONY_COUNT) {
    return false;
  }
  if (player.game.turmoil === undefined && tag === SpecialTags.INFLUENCE) {
    return false;
  }
  if (player.game.gameOptions.venusNextExtension === false && tag === Tags.VENUS) {
    return false;
  }
  if (player.game.gameOptions.moonExpansion === false && tag === Tags.MOON) {
    return false;
  }
  return true;
};

export const PlayerTags = Vue.component('player-tags', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    isActivePlayer: {
      type: Boolean,
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

  methods: {
    showColonyCount: function(): boolean {
      return this.player.game.gameOptions.coloniesExtension;
    },
    showInfluence: function(): boolean {
      return this.player.game.turmoil !== undefined;
    },
    showVenus: function(): boolean {
      return this.player.game.gameOptions.venusNextExtension;
    },
    showMoon: function(): boolean {
      return this.player.game.gameOptions.moonExpansion;
    },
    getTagsPlaceholders: function(): Array<InterfaceTagsType> {
      const tags = PLAYER_INTERFACE_TAGS_ORDER;
      return tags.filter((tag) => {
        return checkTagUsed(tag, this.player);
      });
    },
    getCardCount: function(): number {
      if (this.player.cardsInHandNbr) {
        return this.player.cardsInHandNbr;
      }
      return 0;
    },
    getTR: function(): number {
      return this.player.terraformRating;
    },
    getVpCount: function(): number {
      return this.player.victoryPointsBreakdown.total;
    },
    hideVpCount: function(): boolean {
      return !this.player.game.gameOptions.showOtherPlayersVP && !this.isActivePlayer;
    },
    showShortTags: function(): boolean {
      if (this.hideZeroTags === true) return true;
      return isTagsViewConcise(this.$root);
    },
    hasTagDiscount: function(tag: InterfaceTagsType): boolean {
      for (const card of [...this.player.playedCards, this.player.corporationCard]) {
        if (card !== undefined) {
          if (hasDiscount(tag, card)) {
            return true;
          }
        }
      }

      const turmoil = this.player.game.turmoil;
      if (tag === Tags.SPACE &&
        turmoil && turmoil.ruling === PartyName.UNITY &&
        turmoil.politicalAgendas?.unity.policyId === TurmoilPolicy.UNITY_POLICY_4) {
        return true;
      }

      const iapetusColony = this.player.game.colonies.find((colony) => colony.name === ColonyName.IAPETUS);
      if (tag === 'all' &&
        iapetusColony !== undefined &&
        iapetusColony.visitor !== undefined &&
        iapetusColony.colonies.includes(this.player.color)) {
        return true;
      }

      return false;
    },
    getTagDiscountAmount: function(tag: InterfaceTagsType): number {
      let discount = 0;
      for (const card of [...this.player.playedCards, this.player.corporationCard]) {
        if (card !== undefined) {
          discount += getDiscountAmount(tag, card);
        }
      }

      if (tag === Tags.SPACE && this.player.game.turmoil?.ruling === PartyName.UNITY) {
        if (this.player.game.turmoil.politicalAgendas?.unity.policyId === TurmoilPolicy.UNITY_POLICY_4) discount += 2;
      }

      const iapetusColony = this.player.game.colonies.find((colony) => colony.name === ColonyName.IAPETUS);
      if (tag === 'all' && iapetusColony !== undefined && iapetusColony.visitor !== undefined) {
        discount += iapetusColony.colonies.filter((owner) => owner === this.player.color).length;
      }

      return discount;
    },
    getTagCount: function(tagName: InterfaceTagsType): number {
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
    showJovianMultipliers: function(tag: InterfaceTagsType): boolean {
      return tag === Tags.JOVIAN && this.playerJovianMultipliersCount() > 0;
    },
    playerJovianMultipliersCount: function(): number {
      let multipliers = 0;
      for (const card of this.player.playedCards) {
        if (card !== undefined && JOVIAN_MULTIPLIERS.includes(card.name as CardName)) {
          multipliers += 1;
        }
      }
      return multipliers;
    },
  },
  template: `
        <div class="player-tags">
            <div class="player-tags-main">
                <tag-count :tag="'vp'" :count="getVpCount()" :size="'big'" :type="'main'" :hideCount="hideVpCount()" />
                <tag-count :tag="'tr'" :count="getTR()" :size="'big'" :type="'main'"/>
                <div class="tag-and-discount">
                  <PlayerTagDiscount v-if="hasTagDiscount('all')" :amount="getTagDiscountAmount('all')" :color="player.color" />
                  <tag-count :tag="'cards'" :count="getCardCount()" :size="'big'" :type="'main'"/>
                </div>
            </div>
            <div class="player-tags-secondary">
                <template v-if="showShortTags()">
                  <div class="tag-count-container" v-for="tag in player.tags">
                    <div class="tag-and-discount" :key="tag.tag">
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
    `,
});
