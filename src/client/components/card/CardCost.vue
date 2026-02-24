<template>
  <div>
    <div :class="getClasses()">{{ amount === null ? 0 : amount }}</div>
    <template v-if="displayTwoCosts()">
      <div class="card-cost-transition"></div>
      <div class="card-old-cost">{{ newCost }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {getPreferences} from '@/client/utils/PreferencesManager';

const props = withDefaults(defineProps<{
  amount?: number;
  newCost?: number;
}>(), {
  amount: undefined,
  newCost: undefined,
});

function getClasses(): string {
  const classes = ['card-cost'];
  if (props.amount === undefined) {
    classes.push('visibility-hidden');
  }
  return classes.join(' ');
}

function displayTwoCosts(): boolean {
  const hideDiscount = getPreferences().hide_discount_on_cards;
  return props.newCost !== undefined && props.newCost !== props.amount && !hideDiscount;
}
</script>
