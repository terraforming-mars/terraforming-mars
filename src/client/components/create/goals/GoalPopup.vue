<template>
  <PopupPanel class="create-game-ma-popup" @close="$emit('close')">
    <template #header>
      <h2>
        <span v-i18n>Milestones and Awards</span>&nbsp;<a :href="WIKI_URLS.randomMilestonesAndAwards" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
      </h2>
    </template>
    <GoalRadioButton heading="Type" name="randomGoalType" :choices="RANDOM_GOAL_TYPES" :labels="RANDOM_GOAL_TYPE_LABELS" :modelValue="goals.type" @update:modelValue="update({type: $event})" />

    <template v-if="goals.type === 'random'">
      <GoalRadioButton heading="Pool" name="maPool" :choices="POOLS" :labels="POOL_LABELS" :modelValue="goals.random.pool" @update:modelValue="update({random: {...goals.random, pool: $event}})" />
      <GoalRadioButton heading="Randomness" name="maRandomness" :choices="RANDOMNESS" :labels="RANDOMNESS_LABELS" :modelValue="goals.random.randomness" @update:modelValue="update({random: {...goals.random, randomness: $event}})" />
    </template>

    <GoalChooser v-if="goals.type === 'manual'" :selected="goals.selected" @update:selected="update({selected: $event})" :limit="limit" />
  </PopupPanel>
</template>

<script setup lang="ts">
import PopupPanel from '../../common/PopupPanel.vue';
import GoalChooser from './GoalChooser.vue';
import GoalRadioButton from './GoalRadioButton.vue';
import {WIKI_URLS} from '@/client/utils/WikiLinks';
import {GoalSettings, POOLS, RANDOM_GOAL_TYPES, RANDOMNESS} from './types';
import {POOL_LABELS, RANDOM_GOAL_TYPE_LABELS, RANDOMNESS_LABELS} from './labels';

defineProps<{
  /** How many milestones, and how many awards, a hand-picked selection needs. */
  limit: number,
}>();

defineEmits<{'close': []}>();

const goals = defineModel<GoalSettings>({required: true});

function update(part: Partial<GoalSettings>) {
  goals.value = {...goals.value, ...part};
}
</script>

<style scoped lang="less">
// A fixed-size popup whose body fills the space under the header, so the chooser can fill it.
.create-game-ma-popup :deep(.popup-inner) {
  display: flex;
  flex-direction: column;
}

.create-game-ma-popup :deep(.popup-body) {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
}
</style>
