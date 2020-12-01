import Vue from 'vue';
import {CardRequirements} from '../../cards/CardRequirements';

export const CardRequirementsComponent = Vue.component('CardRequirements', {
  props: {
    requirements: {
      type: Object as () => CardRequirements,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['card-requirements'];
      if (this.requirements.hasMax()) {
        classes.push('card-requirements-max');
      }
      return classes.join(' ');
    },
  },
  template: `
        <div v-if="requirements.hasParty()" :class="getClasses()">
            <span class="party">{{ requirements.getRequirementsText() }}</span>
        </div>
        <div v-else-if="requirements.hasPlantsRemoved()" :class="getClasses()"> 
            <div class="card-special card-minus"></div>
            <div class="card-resource card-resource-plant red-outline"></div>
        </div>
        <div v-else :class="getClasses()">{{ requirements.getRequirementsText() }}</div>
    `,
});
