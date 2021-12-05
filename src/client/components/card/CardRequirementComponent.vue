<template>
  <div class="card-requirement">
      <div class="card-item-container">
        <span v-if="requirement.isMax">MAX&nbsp;</span>
        {{amount()}}{{suffix()}}
        <div :class="getComponentClasses()"></div>
        {{getText()}}
        <CardParty v-if="isPartyRequirement()" class="" :party="getParty()" />
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRequirement, PartyCardRequirement, ProductionCardRequirement, TagCardRequirement} from '@/cards/CardRequirement';
import {RequirementType} from '@/cards/RequirementType';
import {generateClassString} from '@/utils/utils';
import CardParty from '@/client/components/card/CardParty.vue';
import {PartyName} from '@/turmoil/parties/PartyName';

export default Vue.extend({
  name: 'CardRequirementComponent',
  props: {
    requirement: {
      type: Object as () => CardRequirement,
      required: true,
    },
  },
  components: {
    CardParty,
  },
  methods: {
    amount(): string | number {
      // <span v-if="requirement.isMax || requirement.amount != 0">{{requirement.amount}}</span>
      switch (this.requirement.type) {
      case RequirementType.TEMPERATURE:
      case RequirementType.OXYGEN:
      case RequirementType.VENUS:
      case RequirementType.COLONY_RATE:
      case RequirementType.MINING_RATE:
      case RequirementType.LOGISTIC_RATE:
        return this.requirement.amount;
      }
      if (this.requirement.isMax) {
        return this.requirement.amount;
      }
      if (this.requirement.amount !== 1) {
        return this.requirement.amount;
      }
      return '';
    },
    suffix(): string {
      switch (this.requirement.type) {
      case RequirementType.OXYGEN:
      case RequirementType.VENUS:
        return '%';
      case RequirementType.TEMPERATURE:
        return '°C';
      }
      return '';
    },
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
        const productionRequirement = this.requirement as ProductionCardRequirement;
        return ['card-resource', 'card-resource-' + productionRequirement.resource];
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
      case RequirementType.REMOVED_PLANTS:
        break;
      case RequirementType.COLONY_RATE:
        return ['card-colony-rate--S'];
      case RequirementType.MINING_RATE:
        return ['card-mining-rate--S'];
      case RequirementType.LOGISTIC_RATE:
        return ['card-logistics-rate--S'];
      case RequirementType.COLONY_TILES:
        return ['card-tile-lunar-colony--S'];
      case RequirementType.MINING_TILES:
        return ['card-tile-lunar-mine--S'];
      case RequirementType.ROAD_TILES:
        return ['card-tile-lunar-road--S'];
      }
      return [];
    },
    getText(): string {
      switch (this.requirement.type) {
      case RequirementType.REMOVED_PLANTS:
        return this.requirement.type;
      case RequirementType.RESOURCE_TYPES:
        return 'production';
      }
      return '';
    },
    isPartyRequirement(): boolean {
      return this.requirement.type === RequirementType.PARTY;
    },
    getParty(): PartyName {
      if (this.isPartyRequirement()) {
        return (this.requirement as PartyCardRequirement).party;
      } else {
        // Doesn't matter what this value is, as it is ignored.
        return PartyName.GREENS;
      }
    },
  },
});
</script>

