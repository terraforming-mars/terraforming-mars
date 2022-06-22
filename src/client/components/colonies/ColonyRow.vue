<template>
   <div class="colony-grid-container"> <!--   <div v-if="metadata.name === ColonyName.VENUS" style="margin-top:5px;"> -->
     <build-benefit :metadata="metadata" :idx="0"></build-benefit>
     <build-benefit :metadata="metadata" :idx="1"></build-benefit>
     <build-benefit :metadata="metadata" :idx="2"></build-benefit>
     <div></div>
     <div></div>
     <div></div>
     <div></div>
  </div>
</template>
<script lang="ts">

import Vue from 'vue';

import {ColonyName} from '@/common/colonies/ColonyName';
import {IColonyMetadata} from '@/common/colonies/IColonyMetadata';
import BuildBenefit from './BuildBenefit.vue';

export default Vue.extend({
  components: {BuildBenefit},
  name: 'ColonyRow',
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
});
</script>
