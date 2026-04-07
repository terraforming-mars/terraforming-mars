<template>
  <span>{{playerName}}</span>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {PublicPlayerModel} from '@/common/models/PlayerModel';

export default defineComponent({
  name: 'SelectPlayerRow',
  props: {
    player: {
      type: Object as () => PublicPlayerModel | undefined,
      required: true,
    },
    fallbackName: {
      type: String,
      default: '',
    },
  },
  computed: {
    playerName(): string {
      return this.player?.name ?? this.fallbackName;
    },
  },
});

</script>
