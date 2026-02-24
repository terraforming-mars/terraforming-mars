<template>
  <div class="card-resources-counter">
      <span class="card-resources-counter-number"> {{ amount }}</span>
      <span class="card-resource" :class="cssClass"></span>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {CardResource} from '@/common/CardResource';
import {cardResourceCSS} from '../common/cardResources';

const props = defineProps<{
  amount: number;
  type: CardResource;
}>();

const cssClass = computed<string>(() => {
  return cardResourceCSS[props.type];
});
</script>
