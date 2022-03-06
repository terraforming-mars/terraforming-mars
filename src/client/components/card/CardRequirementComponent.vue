<template>
  <div class="card-requirement">
      <div class="card-item-container">
        <template v-if="requirement.isMax">max&nbsp;</template>
        <span v-if="!isRepeated">{{amount()}}</span>{{suffix()}}
        <template v-if="requirement.type === RequirementType.REMOVED_PLANTS">
          <div class="card-special card-minus"></div>
          <div class="card-resource card-resource-plant red-outline"></div>
        </template>
        <template v-if="requirement.type === RequirementType.PRODUCTION">
          <div class="card-production-box card-production-box--req">
            <div class="card-production-box-row">
              <div class="card-production-box-row-item">
                <div class="card-item-container">
                  <div :class="getProductionClass()"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <CardParty v-else-if="requirement.type === RequirementType.PARTY" :party="getParty()" size="req" />
        <template v-else>
          <template v-for="num in repeats">
            <div :class="getComponentClasses()" :key="num"></div>
          </template>
        </template>
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {
  ICardRequirement, IPartyCardRequirement, IProductionCardRequirement, ITagCardRequirement,
} from '@/common/cards/ICardRequirement';
import {RequirementType} from '@/common/cards/RequirementType';
import {generateClassString, range} from '@/common/utils/utils';
import CardParty from '@/client/components/card/CardParty.vue';
import {PartyName} from '@/common/turmoil/PartyName';

export default Vue.extend({
  name: 'CardRequirementComponent',
  props: {
    requirement: {
      type: Object as () => ICardRequirement,
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
        return ['card-global-requirement', 'card-oxygen--req'];
      case RequirementType.TEMPERATURE:
        return ['card-global-requirement', 'card-temperature--req'];
      case RequirementType.OCEANS:
        return ['card-global-requirement', 'card-ocean--req'];
      case RequirementType.VENUS:
        return ['card-global-requirement', 'card-venus--req'];
      case RequirementType.TR:
        return ['card-tile', 'card-tr', 'card-tr--req'];
      case RequirementType.RESOURCE_TYPES:
        return ['card-resource', 'card-resource-wild'];
      case RequirementType.GREENERIES:
        return ['card-tile', 'greenery-tile--M', 'tile--req'];
      case RequirementType.CITIES:
        return ['card-tile', 'city-tile--M', 'tile--req'];
      case RequirementType.COLONIES:
        return ['card-resource-colony', 'card-resource-colony--req'];
      case RequirementType.FLOATERS:
        return ['card-resource-tag--S', 'card-tag-floater'];
      case RequirementType.CHAIRMAN:
        return ['card-chairman--req'];
      case RequirementType.PARTY_LEADERS:
        return ['card-party-leader--req'];
      case RequirementType.TAG:
        const tagRequirement = this.requirement as ITagCardRequirement;
        return ['card-resource-tag--S', 'card-tag-' + tagRequirement.tag];
      case RequirementType.COLONY_RATE:
        return ['card-colony-rate', 'card-colony-rate--req'];
      case RequirementType.MINING_RATE:
        return ['card-mining-rate', 'card-mining-rate--req'];
      case RequirementType.LOGISTIC_RATE:
        return ['card-logistics-rate', 'card-logistics-rate--req'];
      case RequirementType.COLONY_TILES:
        return ['card-tile-lunar-colony--S', 'tile--req'];
      case RequirementType.MINING_TILES:
        return ['card-tile-lunar-mine--S', 'tile--req'];
      case RequirementType.ROAD_TILES:
        return ['card-tile-lunar-road--S', 'tile--req'];
      case RequirementType.PRODUCTION:
      case RequirementType.REMOVED_PLANTS:
        break;
      }
      return [];
    },
    getParty(): PartyName {
      if (this.requirement.type === RequirementType.PARTY) {
        return (this.requirement as IPartyCardRequirement).party;
      } else {
        // Doesn't matter what this value is, as it is ignored.
        return PartyName.GREENS;
      }
    },
    getProductionClass(): string {
      if (this.requirement.type === RequirementType.PRODUCTION) {
        const resource = (this.requirement as IProductionCardRequirement).resource;
        return `card-resource card-resource-${resource}`;
      } else {
        // Doesn't matter what this value is, as it is ignored.
        return '';
      }
    },
  },
  computed: {
    RequirementType() {
      return RequirementType;
    },
    isRepeated(): boolean {
      switch (this.requirement.type) {
      case RequirementType.OXYGEN:
      case RequirementType.TEMPERATURE:
      case RequirementType.VENUS:
      case RequirementType.CHAIRMAN:
      case RequirementType.PARTY:
      case RequirementType.REMOVED_PLANTS:
        return false;
      }
      return this.requirement.amount < 4;
    },
    repeats(): Array<number> {
      if (!this.isRepeated || this.requirement.amount === undefined) {
        return [1];
      }
      return range(this.requirement.amount);
    },
  },
});
</script>

