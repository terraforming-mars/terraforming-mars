<template>
  <span>{{player === undefined ? "" : player.name}}</span>
</template>

<script lang="ts">

import Vue from 'vue';
import {PublicPlayerModel} from '@/common/models/PlayerModel';

export default Vue.extend({
  name: 'SelectPlayerRow',
  props: {
    player: {
      type: Object as () => PublicPlayerModel | undefined,
    },
  },
  methods: {
  },
  data() {
    return {};
  },
});

</script>
