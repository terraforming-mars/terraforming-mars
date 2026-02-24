<template>
  <div :class="classes" v-i18n>({{ description }})</div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {isIDescription} from '@/common/cards/render/ICardRenderDescription';

const props = defineProps<{
  item: unknown;
}>();

const classes = computed<ReadonlyArray<string>>(() => {
  const classes: string[] = ['card-description'];
  if (isIDescription(props.item)) {
    if (props.item.align !== 'center') {
      classes.push('card-description-aligned');
    }
    classes.push('card-description-align--' + props.item.align);
  }
  return classes;
});

const description = computed<string>(() => {
  return isIDescription(props.item) ? props.item.text : String(props.item);
});
</script>
