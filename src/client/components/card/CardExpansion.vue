<template>
  <div :class="templateClasses">
    <div class="project-icon" :class="iconClass(props.expansion)"></div>
    <div v-for="module in modules" class="project-icon" :class="module + '-icon'" :key="module"></div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {GameModule} from '@/common/cards/GameModule';

const props = defineProps<{
  expansion: GameModule;
  isCorporation: boolean;
  isResourceCard: boolean;
  compatibility: Array<GameModule>;
}>();

function iconClass(module: GameModule): string {
  return module === 'base' ? '' : module + '-icon';
}

const modules = computed(() => props.compatibility.filter((e) => e !== props.expansion));
const templateClasses = computed(() => {
  if (props.isCorporation) {
    return 'card-corporation-expansion';
  } else {
    if (props.isResourceCard) {
      return 'resource-card-icon-expansion-container';
    } else {
      return 'project-icon-expansion-container';
    }
  }
});
</script>
