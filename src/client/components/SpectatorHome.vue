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

    <players-overview class="player_home_block player_home_block--players nofloat" :playerView="spectator" v-trim-whitespace id="shortkey-playersoverview"/>

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
      :pathfindersExpansion="game.gameOptions.pathfindersExpansion"
      :altVenusBoard="game.gameOptions.altVenusBoard"
      :aresData="game.aresData"
      :hideTiles="hideTiles"
      @toggleHideTiles="hideTiles = !hideTiles"
      id="shortkey-board"
    />

    <turmoil v-if="game.turmoil" :turmoil="game.turmoil"/>

    <MoonBoard v-if="game.gameOptions.moonExpansion" :model="game.moon" :hideTiles="hideTiles"/>

    <div v-if="spectator.players.length > 1" class="player_home_block--milestones-and-awards">
        <Milestone :milestones_list="game.milestones" />
        <Awards :awards="game.awards" />
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
        <div v-if="game.gameOptions.pathfindersExpansion">
          <PlanetaryTracks :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>
        </div>
    </div>
    <waiting-for v-show="false" v-if="game.phase !== 'end'" :players="spectator.players" :playerView="spectator" :settings="settings" :waitingfor="undefined"></waiting-for>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {GameModel} from '@/models/GameModel';
import {mainAppSettings} from './App';

import * as raw_settings from '@/genfiles/settings.json';
import {SpectatorModel} from '@/models/SpectatorModel';
import Awards from '@/client/components/Awards.vue';
import Board from '@/client/components/Board.vue';
import Colony from '@/client/components/Colony.vue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import LogPanel from '@/client/components/LogPanel.vue';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import Milestone from '@/client/components/Milestone.vue';
import Sidebar from '@/client/components/Sidebar.vue';
import Turmoil from '@/client/components/Turmoil.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import {range} from '@/utils/utils';

export interface SpectatorHomeModel {
  hideTiles: boolean;
  waitingForTimeout: number;
}

export default Vue.extend({
  name: 'SpectatorHome',
  data(): SpectatorHomeModel {
    return {
      hideTiles: false,
      waitingForTimeout: this.settings.waitingForTimeout as typeof raw_settings.waitingForTimeout,
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
    Awards,
    Board,
    Colony,
    DynamicTitle,
    LogPanel,
    Milestone,
    MoonBoard,
    PlanetaryTracks,
    PlayersOverview,
    Sidebar,
    Turmoil,
    WaitingFor,
  },
  methods: {
    forceRerender() {
      // TODO(kberg): this is very inefficient. It pulls down the entire state, ignoring the value of 'waitingFor' which only fetches a short state.
      const root = this.$root as unknown as typeof mainAppSettings.methods;
      root.updateSpectator();
    },
    range(n: number): Array<number> {
      return range(n);
    },
  },
});
</script>
