<template>
  <div class="log-generations">
    <slot name="title"></slot>
    <div class="log-gen-title" v-i18n>Gen: </div>
    <div class="log-gen-numbers">
      <div v-for="n in range" :key="n" class="log-gen-indicator" :class="selectedClass(n)" @click.prevent="$emit('selected', n)">
        {{ n }}
      </div>
    </div>
    <span class="label-additional" v-if="lastSoloGeneration !== undefined">
      <span :class="lastGenerationClass" v-i18n>of {{lastSoloGeneration}}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import * as utils from '@/common/utils/utils';

const props = defineProps<{
  max: number;
  selected: number;
  lastSoloGeneration?: number;
}>();

defineEmits<{
  selected: [gen: number];
}>();

const range = computed(() => utils.range(props.max + 1).slice(1));

const lastGenerationClass = computed(() => {
  return props.lastSoloGeneration === props.max ? 'last-generation blink-animation' : '';
});

function selectedClass(gen: number): string {
  return gen === props.selected ? 'log-gen-indicator--selected' : '';
}
</script>
