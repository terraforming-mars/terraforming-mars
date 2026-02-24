<template>
  <div v-i18n title="Moon habitat, logistics, and mining rates">
    <div class="moon-tile"/>
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
        <span class="logistics">{{ moonData.logisticsRate }}</span>
        <span class="mining">{{ moonData.miningRate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed} from 'vue';
import {MAXIMUM_HABITAT_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE} from '@/common/constants';
import {MoonModel} from '@/common/models/MoonModel';

const props = defineProps<{
  moonData: MoonModel;
}>();

const isMax = computed((): boolean => {
  return (
    props.moonData.habitatRate >= MAXIMUM_HABITAT_RATE &&
    props.moonData.miningRate >= MAXIMUM_MINING_RATE &&
    props.moonData.logisticsRate >= MAXIMUM_LOGISTICS_RATE
  );
});
</script>
