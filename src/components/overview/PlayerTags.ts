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

interface CardTagDiscount {
  tag: InterfaceTagsType,
  amount: number
}
type InterfaceTagsType = Tags | SpecialTags | 'all' | 'separator';

const JOVIAN_MULTIPLIERS: Array<CardName> = [
  CardName.IO_MINING_INDUSTRIES,
  CardName.GANYMEDE_COLONY,
  CardName.WATER_IMPORT_FROM_EUROPA,
];

const DISCOUNTS_MAP: Map<CardName, CardTagDiscount> = new Map([
  [CardName.ANTI_GRAVITY_TECHNOLOGY, {
    tag: 'all',
    amount: 2,
  }],
  [CardName.EARTH_CATAPULT, {
    tag: 'all',
    amount: 2,
  }],
  [CardName.EARTH_OFFICE, {
    tag: Tags.EARTH,
    amount: 3,
  }],
  [CardName.MASS_CONVERTER, {
    tag: Tags.SPACE,
    amount: 2,
  }],
  [CardName.QUANTUM_EXTRACTOR, {
    tag: Tags.SPACE,
    amount: 2,
  }],
  [CardName.RESEARCH_OUTPOST, {
    tag: 'all',
    amount: 1,
  }],
  [CardName.SHUTTLES, {
    tag: Tags.SPACE,
    amount: 2,
  }],
  [CardName.SPACE_STATION, {
    tag: Tags.SPACE,
    amount: 2,
  }],
  [CardName.SKY_DOCKS, {
    tag: 'all',
    amount: 1,
  }],
  [CardName.WARP_DRIVE, {
    tag: Tags.SPACE,
    amount: 4,
  }],
  [CardName.TERACTOR, {
    tag: Tags.EARTH,
    amount: 3,
  }],
  [CardName.THORGATE, {
    tag: Tags.ENERGY,
    amount: 3,
  }],
  [CardName.CHEUNG_SHING_MARS, {
    tag: Tags.BUILDING,
    amount: 2,
  }],
  [CardName.VALLEY_TRUST, {
    tag: Tags.SCIENCE,
    amount: 2,
  }],
  [CardName.VENUS_WAYSTATION, {
    tag: Tags.VENUS,
    amount: 2,
  }],
]);

const hasDiscount = (tag: InterfaceTagsType, cardName: CardName): boolean => {
  if (tag === SpecialTags.COLONY_COUNT || tag === SpecialTags.CITY_COUNT) return false;
  const cardDiscount: CardTagDiscount | undefined = DISCOUNTS_MAP.get(cardName);
  if (cardDiscount !== undefined) {
    return cardDiscount.tag === tag;
  }
  return false;
};

const getDiscountAmount = (tag: InterfaceTagsType, cardName: CardName): number => {
  if (hasDiscount(tag, cardName)) {
    return DISCOUNTS_MAP.get(cardName)?.amount || 0;
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
  if (player.gameOptions.coloniesExtension === false && tag === SpecialTags.COLONY_COUNT) {
    return false;
  }
  if (player.turmoil === undefined && tag === SpecialTags.INFLUENCE) {
    return false;
  }
  if (player.gameOptions.venusNextExtension === false && tag === Tags.VENUS) {
    return false;
  }
  if (player.gameOptions.moonExpansion === false && tag === Tags.MOON) {
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
      return this.player.gameOptions.coloniesExtension;
    },
    showInfluence: function(): boolean {
      return this.player.turmoil !== undefined;
    },
    showVenus: function(): boolean {
      return this.player.gameOptions.venusNextExtension;
    },
    showMoon: function(): boolean {
      return this.player.gameOptions.moonExpansion;
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
      return !this.player.gameOptions.showOtherPlayersVP && !this.isActivePlayer;
    },
    showShortTags: function(): boolean {
      if (this.hideZeroTags === true) return true;
      return isTagsViewConcise(this.$root);
    },
    hasTagDiscount: function(tag: InterfaceTagsType): boolean {
      for (const card of [...this.player.playedCards, this.player.corporationCard]) {
        if (card !== undefined) {
          if (hasDiscount(tag, card.name as CardName)) {
            return true;
          }
        }
      }

      const turmoil = this.player.turmoil;
      if (tag === Tags.SPACE &&
        turmoil && turmoil.ruling === PartyName.UNITY &&
        turmoil.politicalAgendas?.currentAgenda.policyId === TurmoilPolicy.UNITY_POLICY_4) {
        return true;
      }

      const iapetusColony = this.player.colonies.find((colony) => colony.name === ColonyName.IAPETUS);
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
          discount += getDiscountAmount(tag, card.name as CardName);
        }
      }

      if (tag === Tags.SPACE && this.player.turmoil?.ruling === PartyName.UNITY) {
        if (this.player.turmoil.politicalAgendas?.currentAgenda.policyId === TurmoilPolicy.UNITY_POLICY_4) discount += 2;
      }

      const iapetusColony = this.player.colonies.find((colony) => colony.name === ColonyName.IAPETUS);
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
