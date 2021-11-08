<template>
  <div class="card-requirement">
      <div class="card-item-container">
        <span v-if="requirement.isMax">MAX&nbsp;</span>
        <!-- Must show the number if it is temperature or other global requirement?-->
        <span v-if="requirement.isMax || requirement.amount != 0">{{requirement.amount}}</span>
        <div :class="getComponentClasses()" />
        <!-- span>{{requirement.getLabel()}}</span -->
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRequirement, TagCardRequirement} from '@/cards/CardRequirement';
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
    isAny(): string {
      return this.requirement.isAny ? 'red-outline' : '';
    },
    getComponentClasses(): string {
      const classes = this.getComponentClassArray();
      if (this.requirement.isAny) {
        classes.push('red-outline');
      }
      return generateClassString(classes);
    },
    getComponentClassArray(): Array<string> {
      // TODO(kberg): This duplicates CardRenderItemComponent. That shouldn't be
      // necessary.
      switch (this.requirement.type) {
      case RequirementType.OXYGEN:
        return ['card-global-requirement', 'card-oxygen-global-requirement', 'card-oxygen--S'];
      case RequirementType.TEMPERATURE:
        return ['card-global-requirement', 'card-temperature-global-requirement', 'card-temperature--S'];
      case RequirementType.OCEANS:
        return ['card-global-requirement', 'card-ocean-global-requirement', 'card-ocean--S'];
      case RequirementType.VENUS:
        return ['card-global-requirement', 'card-venus-global-requirement', 'card-venus--S'];
      case RequirementType.TR:
        return ['card-tile', 'card-tr'];
      case RequirementType.RESOURCE_TYPES:
      case RequirementType.GREENERIES:
        return ['card-tile', 'greenery-tile--M', 'greenery-tile-small'];
      case RequirementType.CITIES:
        return ['card-tile', 'city-tile--S'];
      case RequirementType.COLONIES:
        return ['card-resource-colony', 'card-resource-colony-S'];
      case RequirementType.FLOATERS:
        return ['card-resource-tag', 'card-tag-science'];
      case RequirementType.CHAIRMAN:
        return ['card-chairman-red'];
      case RequirementType.PARTY_LEADERS:
        break;
      case RequirementType.TAG:
        const tagRequirement = this.requirement as TagCardRequirement;
        return ['card-resource-tag', 'card-tag-' + tagRequirement.tag];
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
      return [];
    },
  },
});
</script>

