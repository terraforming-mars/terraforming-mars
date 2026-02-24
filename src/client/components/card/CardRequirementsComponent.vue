<template>
  <div :class="getClasses">
    <div v-for="(req, idx) in requirements" :key="idx">
      <CardRequirementComponent :requirement="req" :leftMargin="indentRight[idx]"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import CardRequirementComponent from './CardRequirementComponent.vue';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';

const props = defineProps<{
  requirements: ReadonlyArray<CardRequirementDescriptor>;
}>();

const getClasses = computed<string>(() => {
  const hasMax = props.requirements.some((req) => req.max);
  return hasMax ? 'card-requirements card-requirements-max' : 'card-requirements';
});

const indentRight = computed<ReadonlyArray<boolean>>(() => {
  return [false, ...props.requirements.map((req) => (req.nextTo || false))];
});
</script>
