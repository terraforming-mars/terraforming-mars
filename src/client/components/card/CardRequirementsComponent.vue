<template>
  <div :class="getClasses">
    <div v-for="(req, idx) in requirements" :key="idx">
      <card-requirement :requirement="req" :leftMargin="indentRight[idx]"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import CardRequirementComponent from './CardRequirementComponent.vue';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';

export default defineComponent({
  name: 'CardRequirementsComponent',
  props: {
    requirements: {
      type: Array<CardRequirementDescriptor>,
      required: true,
    },
  },
  components: {
    'card-requirement': CardRequirementComponent,
  },
  computed: {
    getClasses(): string {
      const hasMax = this.requirements.some((req) => req.max);
      return hasMax ? 'card-requirements card-requirements-max' : 'card-requirements';
    },
    indentRight(): ReadonlyArray<boolean> {
      return [false, ...this.requirements.map((req) => (req.nextTo || false))];
    },
  },
});
</script>
