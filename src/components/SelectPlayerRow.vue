<template>
  <span>{{player === undefined ? "" : player.name}}</span>
</template>

<script lang="ts">

import Vue from 'vue';
import {PlayerModel} from '../models/PlayerModel';

export default Vue.extend({
  name: 'SelectPlayerRow',
  props: {
    player: {
      type: Object as () => PlayerModel | undefined,
    },
  },
  methods: {
  },
  data: function() {
    return {};
  },
});

</script>
