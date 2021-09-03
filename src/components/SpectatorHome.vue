<template>
  <div id="spectator-home">
    <sidebar v-trim-whitespace
      :acting_player="false"
      :player_color="spectator.color"
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
        <log-panel :id="spectator.id" :players="spectator.players" :generation="game.generation" :lastSoloGeneration="game.lastSoloGeneration" :color="spectator.color"></log-panel>
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

    <!-- TODO(kberg): add the spectator tab. -->
    <div v-if="spectator.game.colonies.length > 0 /* && getCurrentSpectatorTab() === 'colonies' */" class="player_home_block" ref="colonies" id="shortkey-colonies">
        <a name="colonies" class="player_home_anchor"></a>
        <dynamic-title title="Colonies" :color="spectator.color"/>
        <div class="colonies-fleets-cont">
          <div class="colonies-player-fleets" v-for="player in spectator.players" v-bind:key="player.color">
              <div :class="'colonies-fleet colonies-fleet-'+ player.color" v-for="idx in range(player.fleetSize - player.tradesThisGeneration)" v-bind:key="idx"></div>
          </div>
        </div>
        <div class="player_home_colony_cont">
          <div class="player_home_colony" v-for="colony in spectator.game.colonies" :key="colony.name">
              <colony :colony="colony"></colony>
          </div>
        </div>
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
import Colony from './Colony.vue';
import Board from './Board.vue';
import MoonBoard from './moon/MoonBoard.vue';
import Milestone from './Milestone.vue';
import Award from './Award.vue';
import {range} from '../utils/utils';

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
    Award,
    Board,
    Colony,
    LogPanel,
    Milestone,
    MoonBoard,
    Sidebar,
  },
  methods: {
    ...TranslateMixin.methods,
    forceRerender() {
      const root = this.$root as unknown as typeof mainAppSettings.methods;
      root.updateSpectator();
    },
    range(n: number): Array<number> {
      return range(n);
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
