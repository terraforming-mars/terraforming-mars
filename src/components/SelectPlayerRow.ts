
import Vue from 'vue';
import {PlayerModel} from '../models/PlayerModel';

export const SelectPlayerRow = Vue.component('select-player-row', {
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
  template: '<span>{{player === undefined ? "" : player.name}}</span>',
});

