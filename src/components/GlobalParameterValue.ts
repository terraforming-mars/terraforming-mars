import Vue from 'vue';
import {TranslateMixin} from './TranslateMixin';
import {MAXIMUM_COLONY_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE, MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE} from '../constants';
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
      case GlobalParameter.MOON_COLONY_RATE:
        return this.value === MAXIMUM_COLONY_RATE;
      case GlobalParameter.MOON_MINING_RATE:
        return this.value === MAXIMUM_MINING_RATE;
      case GlobalParameter.MOON_LOGISTICS_RATE:
        return this.value === MAXIMUM_LOGISTICS_RATE;
      }
    },
    getClass: function(): string {
      switch (this.param as GlobalParameter) {
      case GlobalParameter.TEMPERATURE:
        return 'temperature-tile';
      case GlobalParameter.OXYGEN:
        return 'oxygen-tile';
      case GlobalParameter.OCEANS:
        return 'ocean-tile';
      case GlobalParameter.VENUS:
        return 'venus-tile';
      case GlobalParameter.MOON_COLONY_RATE:
        return 'temperature-tile';
      case GlobalParameter.MOON_MINING_RATE:
        return 'temperature-tile';
      case GlobalParameter.MOON_LOGISTICS_RATE:
        return 'temperature-tile';
      }
    },
    suffix: function(): string {
      return this.param === GlobalParameter.OXYGEN ? '%' : '';
    },
  },
  template: `
<div>
  <div :class="getClass()"></div>
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
