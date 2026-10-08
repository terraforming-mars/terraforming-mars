<template>
  <div class="card-requirements" :class="{'card-requirements-max': hasMax}">
    <div v-for="(req, idx) in requirements" :key="idx">
      <CardRequirementComponent :requirement="req" :leftMargin="indentRight[idx]"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import CardRequirementComponent from './CardRequirementComponent.vue';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';

export default defineComponent({
  name: 'CardRequirementsComponent',
  props: {
    requirements: {
      type: Array as () => ReadonlyArray<CardRequirementDescriptor>,
      required: false,
    },
  },
  components: {
    CardRequirementComponent,
  },
  computed: {
    hasMax(): boolean {
      return this.requirements?.some((req) => req.max) ?? false;
    },
    indentRight(): ReadonlyArray<boolean> {
      const indentations = [false];
      if (this.requirements) {
        for (const req of this.requirements) {
          indentations.push(req.nextTo || false);
        }
      }
      return indentations;
    },
  },
});
</script>
