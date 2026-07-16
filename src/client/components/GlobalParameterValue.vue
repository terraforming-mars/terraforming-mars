<template>
<div :title="$t(title)">
  <div :class="iconClass"></div>
  <div class="global_params_value">
    <div v-if="isMax">
      <img src="assets/misc/checkmark.png" class="checkmark" :alt="$t('Completed!')">
    </div>
    <div v-else>
      {{value}}{{suffix}}
    </div>
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE} from '@/common/constants';
import {GlobalParameter} from '@/common/GlobalParameter';

// This component is only configured for offial global parameters, and not the moon global parameters.
type BaseGlobalParameter = Exclude<
  GlobalParameter,
  GlobalParameter.MOON_HABITAT_RATE |
  GlobalParameter.MOON_MINING_RATE |
  GlobalParameter.MOON_LOGISTICS_RATE>;

const attributes: Record<BaseGlobalParameter, {max: number, title: string, iconClass: string}> = {
  [GlobalParameter.TEMPERATURE]: {max: MAX_TEMPERATURE, title: 'Temperature', iconClass: 'temperature-tile'},
  [GlobalParameter.OXYGEN]: {max: MAX_OXYGEN_LEVEL, title: 'Oxygen Level', iconClass: 'oxygen-tile'},
  [GlobalParameter.OCEANS]: {max: MAX_OCEAN_TILES, title: 'Oceans', iconClass: 'ocean-tile'},
  [GlobalParameter.VENUS]: {max: MAX_VENUS_SCALE, title: 'Venus Scale', iconClass: 'venus-tile'},
};

export default Vue.extend({
  name: 'global-parameter-value',
  props: {
    param: {
      type: String as () => BaseGlobalParameter,
    },
    value: {
      type: Number,
    },
  },
  computed: {
    isMax(): boolean {
      return this.value === attributes[this.param].max;
    },
    title(): string {
      return attributes[this.param].title;
    },
    iconClass(): string {
      return attributes[this.param].iconClass;
    },
    suffix(): string {
      return this.param === GlobalParameter.OXYGEN ? '%' : '';
    },
  },
});

</script>
