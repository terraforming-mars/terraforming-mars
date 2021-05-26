import Vue from 'vue';
import {DEFAULT_STEEL_VALUE, DEFAULT_TITANIUM_VALUE} from '../../constants';
import {Resources} from '../../Resources';
import {PreferencesManager} from '../PreferencesManager';

export const PlayerResource = Vue.component('player-resource', {
  props: {
    type: {
      type: String as () => Resources,
    },
    canUseHeatAsMegaCredits: {
      type: Boolean || undefined,
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
  },
  data: function() {
    return {
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
    showResourceValue: function(): boolean {
      const learnerModeOn = PreferencesManager.load('learner_mode') === '1';
      switch (this.type) {
      case Resources.STEEL:
        return learnerModeOn || this.steelValue > DEFAULT_STEEL_VALUE;
      case Resources.TITANIUM:
        return learnerModeOn || this.titaniumValue > DEFAULT_TITANIUM_VALUE;
      case Resources.HEAT:
        return this.canUseHeatAsMegaCredits;
      default:
        return false;
      }
    },
    getResourceValue: function(): string {
      if (this.type === Resources.STEEL) {
        return `${this.steelValue}`;
      } else if (this.type === Resources.TITANIUM) {
        return `${this.titaniumValue}`;
      } else if (this.type === Resources.HEAT && this.canUseHeatAsMegaCredits) {
        return '1';
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
                <div v-if="showResourceValue()" class="resource_icon--metalbonus">{{ getResourceValue() }}</div>
            </div>
        </div>
    `,
});
