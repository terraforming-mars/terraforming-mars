<template>
<div :title="$t(getTitle())">
  <div :class="getIconClass()"></div>
  <div class="global_params_value">
    <div v-if="isMax()">
      <img src="/assets/misc/checkmark.png" class="checkmark" :alt="$t('Completed!')">
    </div>
    <div v-else>
      {{value}}{{suffix()}}
    </div>
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE} from '@/common/constants';
import {GlobalParameter} from '@/common/GlobalParameter';

export default Vue.extend({
  name: 'global-parameter-value',
  props: {
    param: {
      type: Number as () => GlobalParameter,
    },
    value: {
      type: Number,
    },
  },
  methods: {
    isMax(): boolean {
      switch (this.param) {
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
    getTitle(): string {
      switch (this.param) {
      case GlobalParameter.TEMPERATURE:
        return 'Temperature';
      case GlobalParameter.OXYGEN:
        return 'Oxygen Level';
      case GlobalParameter.OCEANS:
        return 'Oceans';
      case GlobalParameter.VENUS:
        return 'Venus scale';
      default:
        return '';
      }
    },
    getIconClass(): string {
      switch (this.param) {
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
    suffix(): string {
      return this.param === GlobalParameter.OXYGEN ? '%' : '';
    },
  },
});

</script>
