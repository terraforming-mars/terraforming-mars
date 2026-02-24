<template>
  <span>{{player === undefined ? "" : player.name}}</span>
</template>

<script setup lang="ts">
import {PublicPlayerModel} from '@/common/models/PlayerModel';

defineProps<{
  player: PublicPlayerModel | undefined;
}>();
</script>
