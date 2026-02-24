<template>
  <div class="card-help" @click="click"><a :href="url" target="_blank">?</a></div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {CardName} from '@/common/cards/CardName';

const props = defineProps<{
  name: CardName;
}>();

function click() {
  window.open(url.value, '_blank');
}

const url = computed<string>(() => {
  const anchor = props.name.toLowerCase().replaceAll(' ', '-');
  return 'https://github.com/terraforming-mars/terraforming-mars/wiki/Card-Details#' + anchor;
});
</script>
