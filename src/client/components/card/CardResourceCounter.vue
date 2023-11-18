<template>
  <div class="card-resources-counter">
      <span class="card-resources-counter-number"> {{ amount }}</span>
      <span class="card-resource" :class="cssClass"></span>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardResource} from '@/common/CardResource';

const cssClass: Record<CardResource, string> = {
  [CardResource.ANIMAL]: 'card-resource-animal',
  [CardResource.MICROBE]: 'card-resource-microbe',
  [CardResource.FIGHTER]: 'card-resource-fighter',
  [CardResource.SCIENCE]: 'card-resource-science',
  [CardResource.FLOATER]: 'card-resource-floater',
  [CardResource.ASTEROID]: 'card-resource-asteroid',
  [CardResource.PRESERVATION]: 'card-resource-preservation',
  [CardResource.CAMP]: 'card-resource-camp',
  [CardResource.DISEASE]: 'card-resource-disease',
  [CardResource.RESOURCE_CUBE]: 'card-resource-cube',
  [CardResource.DATA]: 'card-resource-data',
  [CardResource.SYNDICATE_FLEET]: 'card-resource-syndicate-fleet',
  [CardResource.VENUSIAN_HABITAT]: 'card-resource-venusian-habitat',
  [CardResource.SPECIALIZED_ROBOT]: 'card-resource-specialized-robot',
  [CardResource.SEED]: 'card-resource-seed',
  [CardResource.AGENDA]: 'card-resource-agenda',
  [CardResource.ORBITAL]: 'card-resource-orbital',
  [CardResource.GRAPHENE]: 'card-resource-graphene',
  [CardResource.HYDROELECTRIC_RESOURCE]: 'card-resource-hydroelectric-resource',
  [CardResource.CLONE_TROOPER]: 'card-resource-clone-trooper',
  [CardResource.TOOL]: 'card-resource-tool',
  [CardResource.ACTIVIST]: 'card-resource-activist',
};

export default Vue.extend({
  name: 'CardResourceCounter',
  props: {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String as () => CardResource,
      required: true,
    },
  },
  computed: {
    cssClass(): string {
      return cssClass[this.type];
    },
  },
});

</script>

