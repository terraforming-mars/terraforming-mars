<template>
  <div id="spectator-home">
    <template v-if="spectator !== undefined">
      Generation: {{spectator.generation}}
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {SpectatorModel} from '../../src/models/SpectatorModel';

import * as raw_settings from '../genfiles/settings.json';

export interface SpectatorHomeModel {
}

export default Vue.extend({
  name: 'SpectatorHome',
  data: function(): SpectatorHomeModel {
    return {
      spectator: undefined as SpectatorModel | undefined,
    };
  },
  props: {
    settings: {
      type: Object as () => typeof raw_settings,
    },
  },
  components: {
  },
  methods: {
  },
  mounted: function() {
    // TODO load this spectator with XHR
    fetch('/api/spectator' + window.location.search)
      .then((response) => response.json())
      .then((json) => {
        this.$data.spectator = json;
      })
      .catch(() => {
        alert('error pulling information for spectator');
      });
  },
});
</script>

<style lang="less" scoped>
</style>
