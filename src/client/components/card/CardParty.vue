<template>
  <div class="card-party">
  <span :class="classes"></span>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = withDefaults(defineProps<{
  party: string;
  size?: 'card' | 'req';
}>(), {
  size: 'card',
});

const classes = computed<string>(() => {
  const p = props.party.toLowerCase().replace(' ', '-');
  const suffix = props.size === 'req' ? '-req' : '';
  return `card-party--${p}${suffix}`;
});
</script>
