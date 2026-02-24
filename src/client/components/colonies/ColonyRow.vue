<template>
   <div class="colony-grid-container">
    <colony-space v-for="idx in [0, 1, 2, 3, 4, 5, 6]"
      :key="idx"
      :idx="idx"
      :metadata="metadata"
      :player="colony.colonies[idx]"
      :marker="colony.isActive && colony.trackPosition === idx">
    </colony-space>
  </div>
</template>
<script setup lang="ts">

import {ColonyMetadata} from '@/common/colonies/ColonyMetadata';
import {ColonyModel} from '@/common/models/ColonyModel';
import ColonySpace from './ColonySpace.vue';

defineProps<{
  metadata: ColonyMetadata;
  colony: ColonyModel;
}>();
</script>
