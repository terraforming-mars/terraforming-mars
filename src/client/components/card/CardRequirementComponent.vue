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
                  <div v-for="num in repeats" :class="productionClass" :key="num"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <CardParty v-else-if="type === RequirementType.PARTY" :party="party" size="req" />
        <template v-else>
            <div v-for="num in repeats" :key="num" :class="componentClasses"></div>
        </template>
      </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {CardRequirementDescriptor, requirementType} from '@/common/cards/CardRequirementDescriptor';
import {RequirementType} from '@/common/cards/RequirementType';
import {range} from '@/common/utils/utils';
import CardParty from '@/client/components/card/CardParty.vue';
import {PartyName} from '@/common/turmoil/PartyName';

const props = withDefaults(defineProps<{
  requirement: CardRequirementDescriptor;
  leftMargin?: boolean;
}>(), {
  leftMargin: true,
});

const type = computed(() => requirementType(props.requirement));

const count = computed(() => props.requirement.count ?? 0);

const amount = computed<string | number>(() => {
  switch (type.value) {
  case RequirementType.TEMPERATURE:
  case RequirementType.OXYGEN:
  case RequirementType.VENUS:
  case RequirementType.HABITAT_RATE:
  case RequirementType.MINING_RATE:
  case RequirementType.LOGISTIC_RATE:
    return count.value;
  }
  if (props.requirement.max) {
    return count.value;
  }
  if (count.value === 0) {
    return '';
  }
  if (count.value !== 1) {
    return count.value;
  }
  return '';
});

const suffix = computed<string>(() => {
  switch (type.value) {
  case RequirementType.OXYGEN:
  case RequirementType.VENUS:
    return '%';
  case RequirementType.TEMPERATURE:
    return '\u00B0C';
  }
  return '';
});

const componentClasses = computed<Array<string>>(() => {
  const classes = [...componentClassArray.value];
  if (props.requirement.all) {
    classes.push('red-outline');
  }
  return classes;
});

const componentClassArray = computed<Array<string>>(() => {
  switch (type.value) {
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
    return ['card-resource-tag--S', 'card-tag-' + props.requirement.tag];
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
  case RequirementType.UNDERGROUND_TOKENS:
    return ['card-underground-resources'];
  case RequirementType.CORRUPTION:
    return ['card-resource', 'card-resource-corruption'];
  case RequirementType.PRODUCTION:
  case RequirementType.REMOVED_PLANTS:
    break;
  }
  return [];
});

const party = computed<PartyName>(() => {
  if (type.value === RequirementType.PARTY && props.requirement.party) {
    return props.requirement.party;
  } else {
    return PartyName.GREENS;
  }
});

const productionClass = computed<string>(() => {
  if (type.value === RequirementType.PRODUCTION) {
    const resource = props.requirement.production;
    return `card-resource card-resource-${resource}`;
  } else {
    return '';
  }
});

const isRepeated = computed<boolean>(() => {
  switch (type.value) {
  case RequirementType.OXYGEN:
  case RequirementType.TEMPERATURE:
  case RequirementType.VENUS:
  case RequirementType.PARTY:
  case RequirementType.REMOVED_PLANTS:
  case RequirementType.UNDERGROUND_TOKENS:
    return false;
  }
  return count.value > 0 && count.value < 4;
});

const repeats = computed<Array<number>>(() => {
  if (!isRepeated.value || props.requirement.count === undefined) {
    return [1];
  }
  return range(props.requirement.count);
});

const nextTo = computed<string>(() => {
  if (props.requirement.nextTo) {
    return 'nextto-leftside';
  }
  if (props.leftMargin) {
    return 'nextto-rightside';
  }
  return '';
});
</script>
