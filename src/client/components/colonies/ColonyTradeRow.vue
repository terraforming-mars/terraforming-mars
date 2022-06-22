<template>
   <div class="colony-grid-container2"><!--  style="margin-top:55px;"  if VENUS-->
    <template v-if="metadata.name === ColonyName.MERCURY">
      <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
      <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
      <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
      <div><div class="production-box mercury-production-box"><div class="production steel"></div></div></div>
      <div><div class="production-box mercury-production-box"><div class="production steel"></div></div></div>
      <div><div class="production-box mercury-production-box"><div class="production titanium"></div></div></div>
      <div><div class="production-box mercury-production-box"><div class="production titanium"></div></div></div>
    </template>
    <template v-else-if="metadata.name === ColonyName.HYGIEA">
      <div><div class="resource money red-outline"></div></div>
      <div><div class="resource money red-outline"></div></div>
      <div><div class="resource heat red-outline"></div></div>
      <div><div class="resource energy red-outline"></div></div>
      <div><div class="resource plant red-outline"></div></div>
      <div><div class="resource steel red-outline"></div></div>
      <div><div class="resource titanium red-outline"></div></div>
    </template>
    <template v-else-if="metadata.name === ColonyName.EUROPA">
      <div><div class="production-box"><div class="production money">1</div></div></div>
      <div><div class="production-box"><div class="production money">1</div></div></div>
      <div><div class="production-box"><div class="production energy"></div></div></div>
      <div><div class="production-box"><div class="production energy"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
    </template>
    <template v-else v-for="idx in range(7)">
      <div :key="idx">{{metadata.tradeQuantity[idx]}}</div>
    </template>
  </div>
</template>
<script lang="ts">

import Vue from 'vue';

import {ColonyName} from '@/common/colonies/ColonyName';
import {IColonyMetadata} from '@/common/colonies/IColonyMetadata';
import {range} from '@/common/utils/utils';

export default Vue.extend({
  name: 'ColonyTradeRow',
  props: {
    metadata: {
      type: Object as () => IColonyMetadata,
      required: true,
    },
  },
  computed: {
    ColonyName(): typeof ColonyName {
      return ColonyName;
    },
  },
  methods: {
    range(n: number) {
      return range(n);
    },
  },
});
</script>
