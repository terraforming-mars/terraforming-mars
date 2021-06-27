import Vue from 'vue';
import {TranslateMixin} from './TranslateMixin';
import {MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE} from '../constants';
import {GlobalParameter} from '../GlobalParameter';

export const GlobalParameterValue = Vue.component('global-parameter-value', {
  props: {
    param: {
      type: Number, // GlobalParameter
    },
    value: {
      type: Number,
    },
  },
  mixins: [TranslateMixin],
  methods: {
    isMax: function(): boolean {
      switch (this.param as GlobalParameter) {
      case GlobalParameter.TEMPERATURE:
        return this.value === MAX_TEMPERATURE;
      case GlobalParameter.OXYGEN:
        return this.value === MAX_OXYGEN_LEVEL;
      case GlobalParameter.OCEANS:
        return this.value === MAX_OCEAN_TILES;
      case GlobalParameter.VENUS:
        return this.value === MAX_VENUS_SCALE;
      default:
        return false;
      }
    },
    getIconClass: function(): string {
      switch (this.param as GlobalParameter) {
      case GlobalParameter.TEMPERATURE:
        return 'temperature-tile';
      case GlobalParameter.OXYGEN:
        return 'oxygen-tile';
      case GlobalParameter.OCEANS:
        return 'ocean-tile';
      case GlobalParameter.VENUS:
        return 'venus-tile';
      default:
        return '';
      }
    },
    suffix: function(): string {
      return this.param === GlobalParameter.OXYGEN ? '%' : '';
    },
  },
  template: `
<div>
  <div :class="getIconClass()"></div>
  <div class="global_params_value">
    <div v-if="isMax()">
      <img src="/assets/misc/checkmark.png" class="checkmark" :alt="$t('Completed!')">
    </div>
    <div v-else>
      {{this.value}}{{this.suffix()}}
    </div>
  </div>
</div>
  `,
});
