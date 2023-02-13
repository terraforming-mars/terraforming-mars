<template>
  <div>
    <div class="player_home_block">

      <!-- Gameboard -->
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
        :tileView="tileView"
        @toggleTileView="cycleTileView()"
        id="shortkey-board"
      />

      <!-- Expansions -->
      <turmoil v-if="game.turmoil" :turmoil="game.turmoil"/>
      <MoonBoard v-if="game.gameOptions.moonExpansion" :model="game.moon" :tileView="tileView" id="shortkey-moonBoard"/>
      <PlanetaryTracks v-if="game.gameOptions.pathfindersExpansion" :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>

      <!-- Milestones & Awards -->
      <div v-if="playerView.players.length > 1" class="player_home_block--milestones-and-awards">
        <Milestones :milestones="game.milestones" />
        <Awards :awards="game.awards" show-scores/>
      </div>
    </div>

    <players-overview class="player_home_block player_home_block--players nofloat" :playerView="playerView" v-trim-whitespace id="shortkey-playersoverview"/>

    <div class="player_home_block nofloat">
      <log-panel
        :id="playerView.id"
        :players="playerView.players"
        :generation="game.generation"
        :lastSoloGeneration="game.lastSoloGeneration"
        :color="thisPlayer.color"
        :step="game.step"></log-panel>
    </div>

    <!-- Actions -->
    <div class="player_home_block player_home_block--actions nofloat">
      <a name="actions" class="player_home_anchor"></a>
      <dynamic-title title="Actions" :color="thisPlayer.color"/>
      <waiting-for v-if="game.phase !== 'end'" :players="playerView.players" :playerView="playerView" :settings="settings" :waitingfor="playerView.waitingFor"></waiting-for>
    </div>

    <!-- Drafted cards -->
    <div class="player_home_block player_home_block--hand" v-if="playerView.draftedCards.length > 0">
      <dynamic-title title="Drafted cards" :color="thisPlayer.color" />
      <div v-for="card in playerView.draftedCards" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>
    </div>

    <!-- Cards in hand -->
    <a name="cards" class="player_home_anchor"></a>
    <div class="player_home_block player_home_block--hand" v-if="cardsInHandCount > 0" id="shortkey-hand">
      <dynamic-title title="Cards In Hand" :color="thisPlayer.color" :withAdditional="true" :additional="cardsInHandCount.toString()" />
      <sortable-cards :playerId="playerView.id" :cards="playerView.preludeCardsInHand.concat(playerView.ceoCardsInHand).concat(playerView.cardsInHand)" />
    </div>

    <PlayedCards :playerView="playerView" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import PlayedCards from '@/client/components/playerhome/PlayedCards.vue';
import Board from '@/client/components/Board.vue';
import Card from '@/client/components/card/Card.vue';
import Milestones from '@/client/components/Milestones.vue';
import Awards from '@/client/components/Awards.vue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import LogPanel from '@/client/components/LogPanel.vue';
import Turmoil from '@/client/components/turmoil/Turmoil.vue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import SortableCards from '@/client/components/SortableCards.vue';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {nextTileView, TileView} from '@/client/components/board/TileView';

import * as raw_settings from '@/genfiles/settings.json';

export interface PlayingGenerationModel {
  tileView: TileView;
}

export default Vue.extend({
  name: 'playing-generation',
  data(): PlayingGenerationModel {
    return {
      tileView: 'show',
    };
  },
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    settings: {
      type: Object as () => typeof raw_settings,
    },
  },
  computed: {
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    game(): GameModel {
      return this.playerView.game;
    },
    cardsInHandCount(): number {
      const playerView = this.playerView;
      return playerView.cardsInHand.length + playerView.preludeCardsInHand.length + playerView.ceoCardsInHand.length;
    },
  },

  components: {
    'board': Board,
    DynamicTitle,
    Card,
    'players-overview': PlayersOverview,
    'waiting-for': WaitingFor,
    Milestones,
    Awards,
    'log-panel': LogPanel,
    'turmoil': Turmoil,
    'sortable-cards': SortableCards,
    MoonBoard,
    PlanetaryTracks,
    PlayedCards,
  },
  methods: {
    cycleTileView(): void {
      this.tileView = nextTileView(this.tileView);
    },
  },
});

</script>
