import Vue from 'vue';
import {PlayerModel} from '../models/PlayerModel';
import {PlayerInfo} from './overview/PlayerInfo';

export const TopBar = Vue.component('top-bar', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
  },
  components: {
    PlayerInfo,
  },
  data: function() {
    return {};
  },
  methods: {
  },
  template: `
    <div class="top-bar">
      <PlayerInfo :player="player" :activePlayer="player" actionLabel="ahoy" playerIndex="0" :hideZeroTags="true"/>
    </div>
  `,
});
