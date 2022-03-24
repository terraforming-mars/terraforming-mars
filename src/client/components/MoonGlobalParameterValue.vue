<template>
  <div title="Moon colony, logistics, and mining rates">
    <div class="moon-tile"/>
    <div>
      <div v-if="isMax" class="global_params_value">
        <img
          src="/assets/misc/checkmark.png"
          class="checkmark"
          :alt="$t('Completed!')"
          :title="$t('Completed!')"
          data-test="completed-checkmark"
        >
      </div>
      <div v-else class="moon_params_value">
        <span class="colony">{{ moonData.colonyRate }}</span>
        <span class="logistics">{{ moonData.logisticsRate }}</span>
        <span class="mining">{{ moonData.miningRate }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {MAXIMUM_COLONY_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE} from '@/common/constants';
import {MoonModel} from '@/common/models/MoonModel';

export default Vue.extend({
  name: 'MoonGlobalParameterValue',
  props: {
    moonData: {
      type: Object as () => MoonModel,
    },
  },
  computed: {
    isMax(): boolean {
      return (
        this.moonData.colonyRate >= MAXIMUM_COLONY_RATE &&
        this.moonData.miningRate >= MAXIMUM_MINING_RATE &&
        this.moonData.logisticsRate >= MAXIMUM_LOGISTICS_RATE
      );
    },
  },
});
</script>
