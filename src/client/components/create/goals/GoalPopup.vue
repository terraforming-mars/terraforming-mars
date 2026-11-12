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

    <div v-if="goals.type === 'manual'" v-i18n>&#9888;&#xFE0F; Manual milestones and awards are not configurable in the UI yet.</div>
  </PopupPanel>
</template>

<script setup lang="ts">
import PopupPanel from '../../common/PopupPanel.vue';
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

