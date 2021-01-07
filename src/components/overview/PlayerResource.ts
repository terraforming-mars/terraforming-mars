import Vue from 'vue';
import {DEFAULT_STEEL_VALUE, DEFAULT_TITANIUM_VALUE} from '../../constants';
import {Resources} from '../../Resources';
import {TurmoilModel} from '../../models/TurmoilModel';
import {PartyName} from '../../turmoil/parties/PartyName';

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
  },
  data: function() {
    // TODO: Update logic after PoliticalAgendas merge
    const unityTitaniumBonusActive: boolean = this.turmoil !== undefined && this.turmoil.ruling === PartyName.UNITY;

    let playerTitaniumValueWithOffset: number = this.titaniumValue;
    if (unityTitaniumBonusActive) playerTitaniumValueWithOffset -= 1;

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
    isMetal: function(): boolean {
      return (this.type === Resources.STEEL || this.type === Resources.TITANIUM);
    },
    getMetalBonus: function(): string {
      if (this.type === Resources.STEEL) {
        const steelBonus: number = this.steelValue-DEFAULT_STEEL_VALUE;
        return '&#9679;'.repeat(steelBonus);
      } else if (this.type === Resources.TITANIUM) {
        const titaniumBonus: number = this.titaniumValue-DEFAULT_TITANIUM_VALUE;
        return titaniumBonus <= 2 ? '&#9679;'.repeat(titaniumBonus) : '&#9679;&#9679;<br>'+'&#9679;'.repeat(titaniumBonus-2);
      } else {
        return '';
      }
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
                <div v-if="isMetal()" class="alloys" v-html="getMetalBonus()"></div>
            </div>
        </div>
    `,
});
