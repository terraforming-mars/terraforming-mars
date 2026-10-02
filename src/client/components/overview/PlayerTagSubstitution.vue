<template>
  <div class="player-tag-substitution">
    <div :class="'player-tag-substitution-icon tag-' + tag"></div>
  </div>
</template>

<script setup lang="ts">
import {Tag} from '@/common/cards/Tag';

defineProps<{
  // The tag that also counts as the tag this badge is attached to.
  tag: Tag;
}>();
</script>
