<template>
  <div class="card-requirement">
      <div class="card-item-container">
        <div :class="getComponentClasses()" />
        <span>{{requirement.getLabel()}}</span>
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRequirement} from '@/cards/CardRequirement';
import {RequirementType} from '@/cards/RequirementType';
import {generateClassString} from '@/utils/utils';

export default Vue.extend({
  name: 'CardRequirementComponent',
  props: {
    requirement: {
      type: Object as () => CardRequirement,
      required: true,
    },
  },
  components: {
    // 'card-requirement': CardRequirementComponent,
  },
  methods: {
    getComponentClasses(): string {
      const classes: Array<string> = [];

      switch (this.requirement.type) {
      case RequirementType.OXYGEN:
        classes.push('card-global-requirement', 'card-oxygen-global-requirement');
        break;
      case RequirementType.TEMPERATURE:
        classes.push('card-global-requirement', 'card-temperature-global-requirement');
        break;
      case RequirementType.OCEANS:
        classes.push('card-global-requirement', 'card-ocean-global-requirement');
        break;
      case RequirementType.VENUS:
        classes.push('card-global-requirement', 'card-venus-global-requirement');
        break;
      case RequirementType.TR:
        classes.push('card-tile', 'card-tr');
        break;
      case RequirementType.RESOURCE_TYPES:
      case RequirementType.GREENERIES:
      case RequirementType.CITIES:
      case RequirementType.COLONIES:
      case RequirementType.FLOATERS:
        classes.push('card-resource-tag card-tag-science');
        break;
      case RequirementType.CHAIRMAN:
      case RequirementType.PARTY_LEADERS:
        break;
      case RequirementType.TAG:
        classes.push('card-resource', 'card-resource-science');
        break;
      case RequirementType.PRODUCTION:
      case RequirementType.PARTY:
      case RequirementType.REMOVED_PLANTS:
      case RequirementType.COLONY_RATE:
      case RequirementType.MINING_RATE:
      case RequirementType.LOGISTIC_RATE:
      case RequirementType.COLONY_TILES:
      case RequirementType.MINING_TILES:
      case RequirementType.ROAD_TILES:
      }
      return generateClassString(classes);
    },
  },
});
</script>

