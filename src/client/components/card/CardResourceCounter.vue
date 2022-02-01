<template>
  <div class="card-resources-counter">
      <span class="card-resources-counter-number"> {{ amount }}</span>
      <span class="card-resource" :class="getClass"></span>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ResourceType} from '@/common/ResourceType';
export default Vue.extend({
  name: 'CardResourceCounter',
  props: {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String as () => ResourceType,
      required: true,
    },
  },
  computed: {
    getClass(): string {
      switch (this.type) {
      case ResourceType.ANIMAL:
        return 'card-resource-animal';
      case ResourceType.MICROBE:
        return 'card-resource-microbe';
      case ResourceType.FIGHTER:
        return 'card-resource-fighter';
      case ResourceType.SCIENCE:
        return 'card-resource-science';
      case ResourceType.FLOATER:
        return 'card-resource-floater';
      case ResourceType.ASTEROID:
        return 'card-resource-asteroid';
      case ResourceType.PRESERVATION:
        return 'card-resource-preservation';
      case ResourceType.CAMP:
        return 'card-resource-camp';
      case ResourceType.DISEASE:
        return 'card-resource-disease';
      case ResourceType.RESOURCE_CUBE:
        return 'card-resource-cube';
      case ResourceType.DATA:
        return 'card-resource-data';
      case ResourceType.SYNDICATE_FLEET:
        return 'card-resource-syndicate-fleet';
      case ResourceType.VENUSIAN_HABITAT:
        return 'card-resource-venusian-habitat';
      case ResourceType.SPECIALIZED_ROBOT:
        return 'card-resource-specialized-robot';
      case ResourceType.SEED:
        return 'card-resource-seed';
      case ResourceType.ORBITAL:
        return 'card-resource-orbital';
      default:
        return '';
      }
    },
  },
});

</script>

