<template>
  <div v-i18n title="Moon habitat, logistic, and mining rates">
    <div class="moon-tile"></div>
    <div>
      <div v-if="isMax" class="global_params_value">
        <img
          src="assets/misc/checkmark.png"
          class="checkmark"
          :alt="$t('Completed!')"
          :title="$t('Completed!')"
          data-test="completed-checkmark"
        >
      </div>
      <div v-else class="moon_params_value">
        <span class="habitat">{{ moonData.habitatRate }}</span>
        <span class="logistic">{{ moonData.logisticRate }}</span>
        <span class="mining">{{ moonData.miningRate }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {MAXIMUM_HABITAT_RATE, MAXIMUM_LOGISTIC_RATE, MAXIMUM_MINING_RATE} from '@/common/constants';
import {MoonModel} from '@/common/models/MoonModel';

export default defineComponent({
  name: 'MoonGlobalParameterValue',
  props: {
    moonData: {
      type: Object as () => MoonModel,
      required: true,
    },
  },
  computed: {
    isMax(): boolean {
      return (
        this.moonData.habitatRate >= MAXIMUM_HABITAT_RATE &&
        this.moonData.miningRate >= MAXIMUM_MINING_RATE &&
        this.moonData.logisticRate >= MAXIMUM_LOGISTIC_RATE
      );
    },
  },
});
</script>
