<template>
  <span>{{player === undefined ? "" : player.name}}</span>
</template>

<script lang="ts">

import Vue from 'vue';
import {PlayerViewModel} from '../models/PlayerModel';

export default Vue.extend({
  name: 'SelectPlayerRow',
  props: {
    player: {
      type: Object as () => PlayerViewModel | undefined,
    },
  },
  methods: {
  },
  data: function() {
    return {};
  },
});

</script>
