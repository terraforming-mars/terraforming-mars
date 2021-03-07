import Vue from 'vue';

import {SpectatorModel} from '../../src/models/SpectatorModel';

import * as raw_settings from '../genfiles/settings.json';

export interface SpectatorHomeModel {
}

export const SpectatorHome = Vue.component('spectator-home', {
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
  },
  template: `<div id="spectator-home"></div>`,
});
