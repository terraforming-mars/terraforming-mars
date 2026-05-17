<template>
  <div id="spectator-home" :class="(game.turmoil ? 'with-turmoil': '')">

    <div v-if="game.phase === 'end'">
      <div class="player_home_block">
        <DynamicTitle title="This game is over!" :color="spectator.color"/>
        <a :href="'the-end?id='+ spectator.id" v-i18n>Go to game results</a>
      </div>
    </div>

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
      :lastSoloGeneration = "game.lastSoloGeneration"
      :deckSize = "game.deckSize"
      :discardPileSize = "game.discardPileSize">
    </sidebar>

    <div class="player_home_block nofloat">
        <log-panel v-if="spectator.id !== undefined" :viewModel="spectator" :color="spectator.color" :step="game.step"></log-panel>
    </div>

    <players-overview class="player_home_block player_home_block--players nofloat" :playerView="spectator" v-trim-whitespace id="shortkey-playersoverview"/>

    <GameBoardView
      :game="game"
      :tileView="tileView"
      :players="spectator.players"
      @toggleTileView="cycleTileView()"
    />

    <div v-if="game.colonies.length > 0" class="player_home_block" ref="colonies" id="shortkey-colonies">
      <a name="colonies" class="player_home_anchor"></a>
      <dynamic-title title="Colonies" :color="spectator.color"/>
      <div class="colonies-fleets-cont">
        <div class="colonies-player-fleets" v-for="player in spectator.players" v-bind:key="player.color">
            <div :class="'colonies-fleet colonies-fleet-'+ player.color" v-for="idx in range(Math.max(0, player.fleetSize - player.tradesThisGeneration))" v-bind:key="idx"></div>
        </div>
      </div>
      <div class="player_home_colony_cont">
        <div class="player_home_colony" v-for="colony in spectator.game.colonies" :key="colony.name">
            <colony :colony="colony" :active="colony.isActive"></colony>
        </div>
      </div>
    </div>
    <waiting-for v-show="false" v-if="game.phase !== 'end'" :playerView="spectator" :waitingfor="undefined"></waiting-for>
    <div v-if="game.spectatorId">
      <a :href="'/spectator?id=' +game.spectatorId" target="_blank" rel="noopener noreferrer" v-i18n>Spectator link</a>
    </div>
    <purge-warning :expectedPurgeTimeMs="game.expectedPurgeTimeMs"></purge-warning>
    <KeyboardShortcuts v-show="keyboardShortcutOpened" @close="keyboardShortcutOpened = false"></KeyboardShortcuts>
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
import KeyboardShortcuts from '@/client/components/KeyboardShortcuts.vue';
import {range} from '@/common/utils/utils';
import {nextTileView, TileView} from './board/TileView';
import {setDocumentTitle} from '@/client/utils/documentTitle';
import {KeyboardNavigation} from './KeyboardNavigation';

export type SpectatorHomeModel = {
  tileView: TileView;
  keyboardShortcutOpened: boolean;
  hotkeyTargets: Array<Element>;
}

export default defineComponent({
  name: 'SpectatorHome',
  data(): SpectatorHomeModel {
    return {
      tileView: 'show',
      keyboardShortcutOpened: false,
      hotkeyTargets: [],
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
    navigatePage(event: KeyboardEvent) {
      // Most '?' are shifted, so process this before the action that exits early with modifiers
      if (event.key === '?') {
        this.keyboardShortcutOpened = !this.keyboardShortcutOpened;
        return;
      }
      if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      const ids: Partial<Record<string, string>> = {
        [KeyboardNavigation.GAMEBOARD]: 'shortkey-board',
        [KeyboardNavigation.PLAYERSOVERVIEW]: 'shortkey-playersoverview',
        [KeyboardNavigation.HAND]: 'shortkey-hand',
        [KeyboardNavigation.COLONIES]: 'shortkey-colonies',
      };
      const inputSource = event.target as Node;
      if (inputSource.nodeName.toLowerCase() !== 'input') {
        const id = ids[event.code];
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            event.preventDefault();
            el.scrollIntoView({block: 'center', inline: 'center', behavior: 'smooth'});
          }
        } else if (event.code.startsWith('Digit')) {
          const ASCII_ONE = '1'.charCodeAt(0);
          const index = event.code.charCodeAt(5) - ASCII_ONE;
          if (index >= 0 && index < this.hotkeyTargets.length) {
            const el = this.hotkeyTargets[index];
            console.log(el);
            if (el) {
              // event.preventDefault();
              el.scrollIntoView({block: 'start', inline: 'center', behavior: 'smooth'});
            }
          }
        }
      }
    },
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
    window.addEventListener('keydown', this.navigatePage);
    const targets = this.$el.getElementsByClassName('hotkey-target');
    for (let i = 0; i < targets.length; i++) {
      const element = targets.item(i);
      if (element) {
        this.hotkeyTargets.push(element);
      }
    }
  },
});
</script>
