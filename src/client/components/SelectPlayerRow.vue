<template>
  <span>{{props.player?.name ?? ""}}</span>
</template>

<script setup lang="ts">
import {PublicPlayerModel} from '@/common/models/PlayerModel';

const props = defineProps<{
  player: PublicPlayerModel | undefined;
}>();
</script>
