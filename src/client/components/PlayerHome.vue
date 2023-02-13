<template>
  <div id="player-home" :class="(game.turmoil ? 'with-turmoil': '')">

    <top-bar :playerView="playerView" />

    <!-- Game status message -->
    <div v-if="game.phase === 'end'">
      <div class="player_home_block">
        <DynamicTitle title="This game is over!" :color="thisPlayer.color"/>
        <a :href="'the-end?id='+ playerView.id" v-i18n>Go to game results</a>
      </div>
    </div>

    <sidebar v-trim-whitespace
      :acting_player="isPlayerActing(playerView)"
      :player_color="thisPlayer.color"
      :generation="game.generation"
      :coloniesCount="game.colonies.length"
      :temperature = "game.temperature"
      :oxygen = "game.oxygenLevel"
      :oceans = "game.oceans"
      :venus = "game.venusScaleLevel"
      :turmoil = "game.turmoil"
      :moonData="game.moon"
      :gameOptions = "game.gameOptions"
      :playerNumber = "playerView.players.length"
      :lastSoloGeneration = "game.lastSoloGeneration">
        <div class="deck-size">{{ game.deckSize }}</div>
    </sidebar>

    <InitialDrafting :playerView="playerView" :settings="settings" v-if="thisPlayer.tableau.length === 0" />

    <div v-if="thisPlayer.tableau.length > 0">
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

    <ColoniesStatus :playerView="playerView" id="shortkey-colonies" />

    <!-- Spectator link -->
    <div v-if="game.spectatorId">
      <a :href="'spectator?id=' +game.spectatorId" target="_blank" rel="noopener noreferrer" v-i18n>Spectator link</a>
    </div>
    <purge-warning :expectedPurgeTimeMs="playerView.game.expectedPurgeTimeMs"></purge-warning>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ColoniesStatus from '@/client/components/playerhome/ColoniesStatus.vue';
import PlayedCards from '@/client/components/playerhome/PlayedCards.vue';
import InitialDrafting from '@/client/components/playerhome/InitialDrafting.vue';
import Board from '@/client/components/Board.vue';
import Card from '@/client/components/card/Card.vue';
import Milestones from '@/client/components/Milestones.vue';
import Awards from '@/client/components/Awards.vue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import Sidebar from '@/client/components/Sidebar.vue';
import LogPanel from '@/client/components/LogPanel.vue';
import Turmoil from '@/client/components/turmoil/Turmoil.vue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import SortableCards from '@/client/components/SortableCards.vue';
import TopBar from '@/client/components/TopBar.vue';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {KeyboardNavigation} from '@/client/components/KeyboardNavigation';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import PurgeWarning from '@/client/components/common/PurgeWarning.vue';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {nextTileView, TileView} from './board/TileView';

import * as raw_settings from '@/genfiles/settings.json';

export interface PlayerHomeModel {
  tileView: TileView;
}

class TerraformedAlertDialog {
  static shouldAlert = true;
}

export default Vue.extend({
  name: 'player-home',
  data(): PlayerHomeModel {
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
    ColoniesStatus,
    InitialDrafting,
    'players-overview': PlayersOverview,
    'waiting-for': WaitingFor,
    Milestones,
    Awards,
    'top-bar': TopBar,
    'sidebar': Sidebar,
    'log-panel': LogPanel,
    'turmoil': Turmoil,
    'sortable-cards': SortableCards,
    MoonBoard,
    PlanetaryTracks,
    PurgeWarning,
    PlayedCards,
  },
  methods: {
    navigatePage(event: KeyboardEvent) {
      const inputSource = event.target as Element;
      if (inputSource.nodeName.toLowerCase() !== 'input') {
        let id: string | undefined = undefined;
        switch (event.code) {
        case KeyboardNavigation.GAMEBOARD:
          id = 'shortkey-board';
          break;
        case KeyboardNavigation.PLAYERSOVERVIEW:
          id = 'shortkey-playersoverview';
          break;
        case KeyboardNavigation.HAND:
          id = 'shortkey-hand';
          break;
        case KeyboardNavigation.COLONIES:
          id = 'shortkey-colonies';
          break;
        default:
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          event.preventDefault();
          el.scrollIntoView({block: 'center', inline: 'center', behavior: 'auto'});
        }
      }
    },
    isPlayerActing(playerView: PlayerViewModel) : boolean {
      return playerView.players.length > 1 && playerView.waitingFor !== undefined;
    },
    getFleetsCountRange(player: PublicPlayerModel): Array<number> {
      const fleetsRange: Array<number> = [];
      for (let i = 0; i < player.fleetSize - player.tradesThisGeneration; i++) {
        fleetsRange.push(i);
      }
      return fleetsRange;
    },
    cycleTileView(): void {
      this.tileView = nextTileView(this.tileView);
    },
  },
  destroyed() {
    window.removeEventListener('keydown', this.navigatePage);
  },
  mounted() {
    window.addEventListener('keydown', this.navigatePage);
    if (this.game.isTerraformed && TerraformedAlertDialog.shouldAlert && getPreferences().show_alerts) {
      alert('Mars is Terraformed!');
      // Avoids repeated calls.
      TerraformedAlertDialog.shouldAlert = false;
    }
  },
});

</script>
