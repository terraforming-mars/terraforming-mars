<template>
  <div :class="getClasses()">
    <div v-for="(req, idx) in requirements.requirements" :key="idx">
      <card-requirement :requirement="req" />
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRequirementComponent from './CardRequirementComponent.vue';
import {ICardRequirements} from '@/common/cards/ICardRequirements';

export default Vue.extend({
  name: 'CardRequirementsComponent',
  props: {
    requirements: {
      type: Object as () => ICardRequirements,
      required: true,
    },
  },
  components: {
    'card-requirement': CardRequirementComponent,
  },
  methods: {
    getClasses(): string {
      const hasMax = this.requirements.requirements.some((req) => req.isMax);
      return hasMax ? 'card-requirements card-requirements-max' : 'card-requirements';
    },
  },
});
</script>
