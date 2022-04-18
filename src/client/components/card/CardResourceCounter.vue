<template>
  <div class="card-resources-counter">
      <span class="card-resources-counter-number"> {{ amount }}</span>
      <span class="card-resource" :class="getClass"></span>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardResource} from '@/common/CardResource';
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
    getClass(): string {
      switch (this.type) {
      case CardResource.ANIMAL:
        return 'card-resource-animal';
      case CardResource.MICROBE:
        return 'card-resource-microbe';
      case CardResource.FIGHTER:
        return 'card-resource-fighter';
      case CardResource.SCIENCE:
        return 'card-resource-science';
      case CardResource.FLOATER:
        return 'card-resource-floater';
      case CardResource.ASTEROID:
        return 'card-resource-asteroid';
      case CardResource.PRESERVATION:
        return 'card-resource-preservation';
      case CardResource.CAMP:
        return 'card-resource-camp';
      case CardResource.DISEASE:
        return 'card-resource-disease';
      case CardResource.RESOURCE_CUBE:
        return 'card-resource-cube';
      case CardResource.DATA:
        return 'card-resource-data';
      case CardResource.SYNDICATE_FLEET:
        return 'card-resource-syndicate-fleet';
      case CardResource.VENUSIAN_HABITAT:
        return 'card-resource-venusian-habitat';
      case CardResource.SPECIALIZED_ROBOT:
        return 'card-resource-specialized-robot';
      case CardResource.SEED:
        return 'card-resource-seed';
      case CardResource.AGENDA:
        return 'card-resource-agenda';
      case CardResource.ORBITAL:
        return 'card-resource-orbital';
      default:
        return '';
      }
    },
  },
});

</script>

