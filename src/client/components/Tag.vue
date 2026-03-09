<template>
  <div :class="getClasses()" :data-tooltip="$t(props.tag)" />
</template>

<script setup lang="ts">
import {Tag} from '@/common/cards/Tag';

const props = defineProps<{
  tag: Tag;
  size: string;
  type?: string;
}>();

function getClasses(): string {
  const classes = ['tag-count', 'tooltip', 'tooltip-bottom'];
  classes.push(`tag-${props.tag}`);
  if (props.size !== undefined) {
    classes.push(`tag-size-${props.size}`);
  }
  if (props.type !== undefined) {
    classes.push(`tag-type-${props.type}`);
  }
  return classes.join(' ');
}
</script>
