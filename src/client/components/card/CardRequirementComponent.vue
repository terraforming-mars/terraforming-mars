<template>
  <div class="card-requirement">
      <div class="card-item-container" :class="nextTo">
        <template v-if="requirement.max">max&nbsp;</template>
        <span v-if="!isRepeated">{{amount}}</span>{{suffix}}
        <template v-if="type === RequirementType.REMOVED_PLANTS">
          <div class="card-special card-minus"></div>
          <div class="card-resource card-resource-plant red-outline"></div>
        </template>
        <template v-if="type === RequirementType.PRODUCTION">
          <div class="card-production-box card-production-box--req">
            <div class="card-production-box-row">
              <div class="card-production-box-row-item">
                <div class="card-item-container">
                  <template v-for="num in repeats">
                    <div :class="productionClass" :key="num"></div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
        <CardParty v-else-if="type === RequirementType.PARTY" :party="party" size="req" />
        <template v-else>
          <template v-for="num in repeats">
            <div :class="componentClasses" :key="num"></div>
          </template>
        </template>
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRequirementDescriptor, requirementType} from '@/common/cards/CardRequirementDescriptor';
import {RequirementType} from '@/common/cards/RequirementType';
import {range} from '@/common/utils/utils';
import CardParty from '@/client/components/card/CardParty.vue';
import {PartyName} from '@/common/turmoil/PartyName';

export default Vue.extend({
  name: 'CardRequirementComponent',
  props: {
    requirement: {
      type: Object as () => CardRequirementDescriptor,
      required: true,
    },
    leftMargin: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    CardParty,
  },
  computed: {
    type(): RequirementType {
      return requirementType(this.requirement);
    },
    count(): number {
      return this.requirement.count ?? 0;
    },
    amount(): string | number {
      switch (this.type) {
      case RequirementType.TEMPERATURE:
      case RequirementType.OXYGEN:
      case RequirementType.VENUS:
      case RequirementType.HABITAT_RATE:
      case RequirementType.MINING_RATE:
      case RequirementType.LOGISTIC_RATE:
        return this.count;
      }
      if (this.requirement.max) {
        return this.count;
      }
      if (this.count === 0) {
        return '';
      }
      if (this.count !== 1) {
        return this.count;
      }
      return '';
    },
    suffix(): string {
      switch (this.type) {
      case RequirementType.OXYGEN:
      case RequirementType.VENUS:
        return '%';
      case RequirementType.TEMPERATURE:
        return '°C';
      }
      return '';
    },
    isAny(): string {
      return this.requirement.all ? 'red-outline' : '';
    },
    componentClasses(): Array<string> {
      const classes = this.componentClassArray;
      if (this.requirement.all) {
        classes.push('red-outline');
      }
      return classes;
    },
    componentClassArray(): Array<string> {
      switch (this.type) {
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
        return ['card-resource-tag--S', 'card-tag-' + this.requirement.tag];
      case RequirementType.HABITAT_RATE:
        return ['card-habitat-rate', 'card-habitat-rate--req'];
      case RequirementType.MINING_RATE:
        return ['card-mining-rate', 'card-mining-rate--req'];
      case RequirementType.LOGISTIC_RATE:
        return ['card-logistics-rate', 'card-logistics-rate--req'];
      case RequirementType.HABITAT_TILES:
        return ['card-tile-lunar-habitat--S', 'tile--req'];
      case RequirementType.MINING_TILES:
        return ['card-tile-lunar-mine--S', 'tile--req'];
      case RequirementType.ROAD_TILES:
        return ['card-tile-lunar-road--S', 'tile--req'];
      case RequirementType.EXCAVATION:
        return ['card-excavation req'];
      case RequirementType.CORRUPTION:
        return ['card-resource', 'card-resource-corruption'];
      case RequirementType.PRODUCTION:
      case RequirementType.REMOVED_PLANTS:
        break;
      }
      return [];
    },
    party(): PartyName {
      if (this.type === RequirementType.PARTY && this.requirement.party) {
        return this.requirement.party;
      } else {
        // Doesn't matter what this value is, as it is ignored.
        return PartyName.GREENS;
      }
    },
    productionClass(): string {
      if (this.type === RequirementType.PRODUCTION) {
        const resource = this.requirement.production;
        return `card-resource card-resource-${resource}`;
      } else {
        // Doesn't matter what this value is, as it is ignored.
        return '';
      }
    },
    RequirementType() {
      return RequirementType;
    },
    isRepeated(): boolean {
      switch (this.type) {
      case RequirementType.OXYGEN:
      case RequirementType.TEMPERATURE:
      case RequirementType.VENUS:
      case RequirementType.PARTY:
      case RequirementType.REMOVED_PLANTS:
        return false;
      }
      return this.count > 0 && this.count < 4;
    },
    repeats(): Array<number> {
      if (!this.isRepeated || this.requirement.count === undefined) {
        return [1];
      }
      return range(this.requirement.count);
    },
    nextTo(): string {
      if (this.requirement.nextTo) {
        return 'nextto-leftside';
      }
      if (this.leftMargin) {
        return 'nextto-rightside';
      }
      return '';
    },
  },
});
</script>
