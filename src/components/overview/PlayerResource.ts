import Vue from 'vue';
import {DEFAULT_STEEL_VALUE, DEFAULT_TITANIUM_VALUE} from '../../constants';
import {Resources} from '../../Resources';
import {TurmoilModel} from '../../models/TurmoilModel';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardModel} from '../../models/CardModel';
import {CardName} from '../../CardName';

export const PlayerResource = Vue.component('player-resource', {
  props: {
    type: {
      type: String as () => Resources,
    },
    count: {
      type: Number,
    },
    production: {
      type: Number,
    },
    plantsAreProtected: {
      type: Boolean || undefined,
    },
    steelValue: {
      type: Number,
    },
    titaniumValue: {
      type: Number,
    },
    turmoil: {
      type: Object as () => TurmoilModel || undefined,
    },
    corporationCard: {
      type: Object as () => CardModel || undefined,
    },
  },
  data: function() {
    // TODO: Update logic after PoliticalAgendas merge
    const unityTitaniumBonusActive: boolean = this.turmoil !== undefined && this.turmoil.ruling === PartyName.UNITY;

    let playerTitaniumValueWithOffset: number = this.titaniumValue;
    if (unityTitaniumBonusActive) playerTitaniumValueWithOffset -= 1;

    if (this.corporationCard.name === CardName.PHOBOLOG) playerTitaniumValueWithOffset -= 1;

    return {
      playerAdjustedTitaniumValue: playerTitaniumValueWithOffset,
    };
  },
  methods: {
    mainCSS: function(): string {
      return 'resource_item--' + this.type;
    },
    iconCSS: function(): string {
      return 'resource_icon--' + this.type;
    },
    productionSign: function(): string {
      if (this.production > 0) return '+';
      return '';
    },
    displayPlantsProtectedIcon: function(): boolean {
      return this.type === Resources.PLANTS && this.plantsAreProtected;
    },
    displayPlusOneSteelValueIcon: function(): boolean {
      return this.type === Resources.STEEL && this.steelValue === DEFAULT_STEEL_VALUE + 1;
    },
    displayPlusTwoSteelValueIcon: function(): boolean {
      return this.type === Resources.STEEL && this.steelValue === DEFAULT_STEEL_VALUE + 2;
    },
    displayPlusOneTitaniumValueIcon: function(): boolean {
      return this.type === Resources.TITANIUM && this.playerAdjustedTitaniumValue === DEFAULT_TITANIUM_VALUE + 1;
    },
    displayPlusTwoTitaniumValueIcon: function(): boolean {
      return this.type === Resources.TITANIUM && this.playerAdjustedTitaniumValue === DEFAULT_TITANIUM_VALUE + 2;
    },
  },
  template: `
        <div class="resource_item" :class="mainCSS()">
            <div class="resource_item_stock">
                <i class="resource_icon" :class="iconCSS()"></i>
                <div class="resource_item_stock_count">{{ count }}</div>
            </div>
            <div class="resource_item_prod">
                <span class="resource_item_prod_count">{{ productionSign() }}{{ production }}</span>
                <div v-if="displayPlantsProtectedIcon()" class="shield_icon"></div>
                <div v-if="displayPlusOneSteelValueIcon()" class="alloys">&#9679;</div>
                <div v-if="displayPlusTwoSteelValueIcon()" class="alloys">&#9679;&#9679;</div>
                <div v-if="displayPlusOneTitaniumValueIcon()" class="alloys">&#9679;</div>
                <div v-if="displayPlusTwoTitaniumValueIcon()" class="alloys">&#9679;&#9679;</div>
            </div>
        </div>
    `,
});
