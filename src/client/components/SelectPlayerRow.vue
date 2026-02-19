<template>
  <span>{{player === undefined ? "" : player.name}}</span>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {PublicPlayerModel} from '@/common/models/PlayerModel';

export default defineComponent({
  name: 'SelectPlayerRow',
  props: {
    player: {
      type: Object as () => PublicPlayerModel | undefined,
    },
  },
});

</script>
