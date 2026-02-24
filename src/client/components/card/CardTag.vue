<template>
  <div :class="getClasses()" />
</template>

<script setup lang="ts">
import {Tag} from '@/common/cards/Tag';

const props = defineProps({
  index: {
    type: Number,
    required: true,
    validator: (i: number) => i < 4,
  },
  type: {
    type: String,
    required: true,
    validator: (type: Tag | 'asterisk') => type === 'asterisk' || Object.values(Tag).includes(type),
  },
});

function getClasses(): string {
  const classes = ['card-tag'];
  classes.push(`tag-${props.type.toLocaleLowerCase()}`);
  return classes.join(' ');
}
</script>
