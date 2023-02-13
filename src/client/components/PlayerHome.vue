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
    <PlayingGeneration :playerView="playerView" :settings="settings" v-if="thisPlayer.tableau.length > 0" />
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
import InitialDrafting from '@/client/components/playerhome/InitialDrafting.vue';
import PlayingGeneration from '@/client/components/playerhome/PlayingGeneration.vue';
import Sidebar from '@/client/components/Sidebar.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import TopBar from '@/client/components/TopBar.vue';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {KeyboardNavigation} from '@/client/components/KeyboardNavigation';
import PurgeWarning from '@/client/components/common/PurgeWarning.vue';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';

import * as raw_settings from '@/genfiles/settings.json';

class TerraformedAlertDialog {
  static shouldAlert = true;
}

export default Vue.extend({
  name: 'player-home',
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
  },

  components: {
    DynamicTitle,
    ColoniesStatus,
    InitialDrafting,
    PlayingGeneration,
    'top-bar': TopBar,
    'sidebar': Sidebar,
    PurgeWarning,
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
