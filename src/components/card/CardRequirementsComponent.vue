<template>
        <div v-if="requirements.hasParty()" :class="getClasses()">
            <span class="party">{{ requirements.getRequirementsText() }}</span>
        </div>
        <div v-else-if="requirements.hasPlantsRemoved()" :class="getClasses()">
            <div class="card-special card-minus"></div>
            <div class="card-resource card-resource-plant red-outline"></div>
        </div>
        <div v-else :class="getClasses()">{{ requirements.getRequirementsText() }}</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRequirements} from '../../cards/CardRequirements';

export default Vue.extend({
  name: 'CardRequirementsComponent',
  props: {
    requirements: {
      type: Object as () => CardRequirements,
      required: true,
    },
  },
  methods: {
    getClasses(): string {
      const classes: Array<string> = ['card-requirements'];
      if (this.requirements.hasMax()) {
        classes.push('card-requirements-max');
      }
      return classes.join(' ');
    },
  },
});

</script>

