<template>
  <div :class="getClasses">
    <div v-for="(req, idx) in requirements" :key="idx">
      <card-requirement :requirement="req" :requirementsModifiers="requirementsModifiers" :leftMargin="indentRight[idx]"/>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRequirementComponent from './CardRequirementComponent.vue';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';
import {RequirementType} from '@/common/cards/RequirementType';

export default Vue.extend({
  name: 'CardRequirementsComponent',
  props: {
    requirements: {
      type: Array<CardRequirementDescriptor>,
      required: true,
    },
    requirementsModifiers: {
      type: Object as () => Map<RequirementType, number>,
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
