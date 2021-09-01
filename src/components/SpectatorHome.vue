<template>
  <div id="spectator-home">
    <template v-if="spectator !== undefined">
      Generation: {{spectator.generation}}
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import {TranslateMixin} from './TranslateMixin';
import {SpectatorModel} from '../../src/models/SpectatorModel';

import * as raw_settings from '../genfiles/settings.json';

export interface SpectatorHomeModel {
  spectator: SpectatorModel | undefined,
}

export default Vue.extend({
  name: 'SpectatorHome',
  data(): SpectatorHomeModel {
    return {
      spectator: undefined,
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
    ...TranslateMixin.methods,
  },
  mounted() {
    // TODO load this spectator with XHR
    fetch('/api/spectator' + window.location.search)
      .then((response) => response.json())
      .then((json) => {
        this.$data.spectator = json;
      })
      .catch((e) => {
        alert('error pulling information for spectator');
        alert(e);
        console.log(e);
      });
  },
});
</script>
