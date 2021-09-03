<template>
  <div id="spectator-home">
    <sidebar v-trim-whitespace
      :acting_player="false"
      :player_color="'grey'"
      :generation="game.generation"
      :coloniesCount="game.colonies.length"
      :temperature = "game.temperature"
      :oxygen = "game.oxygenLevel"
      :oceans = "game.oceans"
      :venus = "game.venusScaleLevel"
      :turmoil = "game.turmoil"
      :moonData="game.moon"
      :gameOptions = "game.gameOptions"
      :playerNumber = "spectator.players.length"
      :lastSoloGeneration = "game.lastSoloGeneration">
        <div class="deck-size">{{ game.deckSize }}</div>
    </sidebar>

    <div class="player_home_block nofloat">
        <log-panel :id="spectator.id" :players="spectator.players" :generation="game.generation" :lastSoloGeneration="game.lastSoloGeneration" :color="'gray'"></log-panel>
    </div>

    <a name="board" class="player_home_anchor"></a>
    <board
      :spaces="game.spaces"
      :venusNextExtension="game.gameOptions.venusNextExtension"
      :venusScaleLevel="game.venusScaleLevel"
      :boardName ="game.gameOptions.boardName"
      :oceans_count="game.oceans"
      :oxygen_level="game.oxygenLevel"
      :temperature="game.temperature"
      :aresExtension="game.gameOptions.aresExtension"
      :aresData="game.aresData"
      :hideTiles="hideTiles"
      @toggleHideTiles="hideTiles = !hideTiles"
      id="shortkey-board"
    />

    <turmoil v-if="game.turmoil" :turmoil="game.turmoil"/>

    <MoonBoard v-if="game.gameOptions.moonExpansion" :model="game.moon" :hideTiles="hideTiles"/>

    <div v-if="spectator.players.length > 1" class="player_home_block--milestones-and-awards">
        <Milestone :milestones_list="game.milestones" />
        <Award :awards_list="game.awards" />
    </div>

  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import {TranslateMixin} from './TranslateMixin';
import {GameModel} from '../models/GameModel';
import {mainAppSettings} from './App';

import * as raw_settings from '../genfiles/settings.json';
import {SpectatorModel} from '../models/SpectatorModel';
import Sidebar from './Sidebar.vue';
import LogPanel from './LogPanel.vue';
import Board from './Board.vue';
import MoonBoard from './moon/MoonBoard.vue';
import Milestone from './Milestone.vue';
import Award from './Award.vue';

let refreshTimeoutId: number = -1;

export interface SpectatorHomeModel {
  hideTiles: boolean;
}

export default Vue.extend({
  name: 'SpectatorHome',
  data(): SpectatorHomeModel {
    return {
      hideTiles: false,
    };
  },
  props: {
    spectator: {
      type: Object as () => SpectatorModel,
    },
    settings: {
      type: Object as () => typeof raw_settings,
    },
  },
  computed: {
    game(): GameModel {
      return this.spectator.game;
    },
  },
  components: {
    Sidebar,
    LogPanel,
    Board,
    Milestone,
    Award,
    MoonBoard,
  },
  methods: {
    ...TranslateMixin.methods,
    forceRerender() {
      const root = this.$root as unknown as typeof mainAppSettings.methods;
      root.updateSpectator();
    },
  },
  beforeDestroy() {
    window.clearInterval(refreshTimeoutId);
  },
  mounted() {
    refreshTimeoutId = window.setInterval(this.forceRerender, 5000);
  },
});
</script>
