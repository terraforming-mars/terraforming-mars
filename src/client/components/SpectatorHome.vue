<template>
  <div id="spectator-home">
    <Sidebar v-trim-whitespace
      :actingPlayer="false"
      :playerColor="spectator.color"
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
      :lastSoloGeneration = "game.lastSoloGeneration"
      :deckSize = "game.deckSize"
      :discardPileSize = "game.discardPileSize"/>

    <div class="player_home_block nofloat">
        <LogPanel v-if="spectator.id !== undefined" :viewModel="spectator" :color="spectator.color" :step="game.step"/>
    </div>

    <PlayersOverview class="player_home_block player_home_block--players nofloat" :playerView="spectator" v-trim-whitespace id="shortkey-playersoverview"/>

    <GameBoardView
      :game="game"
      :tileView="tileView"
      :players="spectator.players"
      @toggleTileView="cycleTileView()"
    />

    <div v-if="spectator.game.colonies.length > 0 /* && getCurrentSpectatorTab() === 'colonies' */" class="player_home_block" ref="colonies" id="shortkey-colonies">
      <a name="colonies" class="player_home_anchor"></a>
      <DynamicTitle title="Colonies" :color="spectator.color"/>
      <div class="colonies-fleets-cont">
        <div class="colonies-player-fleets" v-for="player in spectator.players" :key="player.color">
            <div :class="'colonies-fleet colonies-fleet-'+ player.color" v-for="idx in range(Math.max(0, player.fleetSize - player.tradesThisGeneration))" :key="idx"></div>
        </div>
      </div>
      <div class="player_home_colony_cont">
        <div class="player_home_colony" v-for="colony in spectator.game.colonies" :key="colony.name">
            <Colony :colony="colony" :active="colony.isActive"/>
        </div>
      </div>
        <div v-if="game.gameOptions.expansions.pathfinders">
          <PlanetaryTracks :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>
        </div>
    </div>
    <WaitingFor v-show="false" v-if="game.phase !== 'end'" :players="spectator.players" :playerView="spectator" :waitingfor="undefined"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import {GameModel} from '@/common/models/GameModel';
import {vueRoot} from '@/client/components/vueRoot';

import {SpectatorModel} from '@/common/models/SpectatorModel';
import Colony from '@/client/components/colonies/Colony.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import GameBoardView from '@/client/components/GameBoardView.vue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import Sidebar from '@/client/components/Sidebar.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import {range} from '@/common/utils/utils';
import {nextTileView, TileView} from './board/TileView';
import {setDocumentTitle} from '@/client/utils/documentTitle';

export type SpectatorHomeModel = {
  tileView: TileView;
}

export default defineComponent({
  name: 'SpectatorHome',
  data(): SpectatorHomeModel {
    return {
      tileView: 'show',
    };
  },
  props: {
    spectator: {
      type: Object as () => SpectatorModel,
      required: true,
    },
  },
  computed: {
    game(): GameModel {
      return this.spectator.game;
    },
  },
  components: {
    Colony,
    DynamicTitle,
    GameBoardView,
    LogPanel,
    PlanetaryTracks,
    PlayersOverview,
    Sidebar,
    WaitingFor,
  },
  methods: {
    forceRerender() {
      // TODO(kberg): this is very inefficient. It pulls down the entire state, ignoring the value of 'waitingFor' which only fetches a short state.
      vueRoot(this).updateSpectator();
    },
    range(n: number): Array<number> {
      return range(n);
    },
    cycleTileView(): void {
      this.tileView = nextTileView(this.tileView);
    },
  },
  mounted() {
    setDocumentTitle(this.game.name);
  },
});
</script>
