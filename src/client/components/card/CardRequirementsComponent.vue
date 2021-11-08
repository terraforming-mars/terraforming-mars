<template>
  <div class="card-requirements" :class="getClasses()">
    <div v-for="(req, idx) in requirements.requirements" :key="idx">
      <card-requirement :requirement="req" />
    </div>
  </div>
  <!--
  <div v-else-if="requirements.hasPlantsRemoved()" :class="getClasses()">
      <div class="card-special card-minus"></div>
      <div class="card-resource card-resource-plant red-outline"></div>
  </div>
  -->
</template>

<script lang="ts">

import Vue from 'vue';
import CardRequirementComponent from './CardRequirementComponent.vue';
import {CardRequirements} from '@/cards/CardRequirements';

export default Vue.extend({
  name: 'CardRequirementsComponent',
  props: {
    requirements: {
      type: Object as () => CardRequirements,
      required: true,
    },
  },
  components: {
    'card-requirement': CardRequirementComponent,
  },
  methods: {
    getClasses(): string {
      if (this.requirements.hasMax()) {
        return 'card-requirements-max';
      }
      return '';
    },
  },
});
</script>
