import Vue from 'vue';

import {AndOptions} from './AndOptions';
import {mainAppSettings} from './App';
import {OrOptions} from './OrOptions';
import {PlayerInputFactory} from './PlayerInputFactory';
import {SelectAmount} from './SelectAmount';
import {SelectCard} from './SelectCard';
import {SelectHowToPay} from './SelectHowToPay';
import {SelectHowToPayForProjectCard} from './SelectHowToPayForProjectCard';
import {SelectInitialCards} from './SelectInitialCards';
import {SelectOption} from './SelectOption';
import {SelectPlayer} from './SelectPlayer';
import {SelectSpace} from './SelectSpace';
import {$t} from '../directives/i18n';
import {SelectPartyPlayer} from './SelectPartyPlayer';
import {SelectPartyToSendDelegate} from './SelectPartyToSendDelegate';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import {PreferencesManager} from './PreferencesManager';
import {SoundManager} from './SoundManager';
import {SelectColony} from './SelectColony';
import {SelectProductionToLose} from './SelectProductionToLose';
import {ShiftAresGlobalParameters} from './ShiftAresGlobalParameters';
import {WaitingForModel} from '../models/WaitingForModel';

import * as constants from '../constants';
import * as raw_settings from '../genfiles/settings.json';

let ui_update_timeout_id: number | undefined;
let documentTitleTimer: number | undefined;

export const WaitingFor = Vue.component('waiting-for', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    players: {
      type: Array as () => Array<PlayerModel>,
    },
    settings: {
      type: Object as () => typeof raw_settings,
    },
    waitingfor: {
      type: Object as () => PlayerInputModel | undefined,
    },
  },
  data: function() {
    return {
      waitingForTimeout: this.settings.waitingForTimeout as typeof raw_settings.waitingForTimeout,
    };
  },
  components: {
    'and-options': AndOptions,
    'or-options': OrOptions,
    'select-amount': SelectAmount,
    'select-card': SelectCard,
    'select-option': SelectOption,
    'select-how-to-pay': SelectHowToPay,
    'select-how-to-pay-for-project-card': SelectHowToPayForProjectCard,
    'select-initial-cards': SelectInitialCards,
    'select-player': SelectPlayer,
    'select-space': SelectSpace,
    'select-party-player': SelectPartyPlayer,
    'select-party-to-send-delegate': SelectPartyToSendDelegate,
    'select-colony': SelectColony,
    'select-production-to-lose': SelectProductionToLose,
    'shift-ares-global-parameters': ShiftAresGlobalParameters,
  },
  methods: {
    animateTitle: function() {
      const sequence = '\u25D1\u25D2\u25D0\u25D3';
      const first = document.title[0];
      const position = sequence.indexOf(first);
      let next = sequence[0];
      if (position !== -1 && position < sequence.length - 1) {
        next = sequence[position + 1];
      }
      document.title = next + ' ' + $t(constants.APP_NAME);
    },
    waitForUpdate: function() {
      const vueApp = this;
      const root = this.$root as unknown as typeof mainAppSettings.methods;
      clearTimeout(ui_update_timeout_id);
      const askForUpdate = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/waitingfor' + window.location.search + '&gameAge=' + this.player.game.gameAge + '&undoCount=' + this.player.game.undoCount);
        xhr.onerror = function() {
          root.showAlert('Unable to reach the server. The server may be restarting or down for maintenance.', () => vueApp.waitForUpdate());
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const result = xhr.response as WaitingForModel;
            if (result.result === 'GO') {
              root.updatePlayer();

              // Only show notification for multi-player games
              // todo bafolts remove once undo refactor complete
              if (this.player.players.length > 1) {
                if (Notification.permission !== 'granted') {
                  Notification.requestPermission();
                }
                if (Notification.permission === 'granted') {
                  new Notification(constants.APP_NAME, {
                    icon: '/favicon.ico',
                    body: 'It\'s your turn!',
                  });
                }
              }
              const soundsEnabled = PreferencesManager.load('enable_sounds') === '1';
              if (soundsEnabled) SoundManager.playActivePlayerSound();

              // We don't need to wait anymore - it's our turn
              return;
            } else if (result.result === 'REFRESH') {
              // Something changed, let's refresh UI
              root.updatePlayer();

              return;
            }
            vueApp.waitForUpdate();
          } else {
            root.showAlert(`Received unexpected response from server (${xhr.status}). This is often due to the server restarting.`, () => vueApp.waitForUpdate());
          }
        };
        xhr.responseType = 'json';
        xhr.send();
      };
      ui_update_timeout_id = window.setTimeout(askForUpdate, this.waitingForTimeout);
    },
  },
  render: function(createElement) {
    document.title = $t(constants.APP_NAME);
    window.clearInterval(documentTitleTimer);
    if (this.waitingfor === undefined) {
      this.waitForUpdate();
      let message = 'Not your turn to take any actions';
      // todo bafolts remove once undo refactor complete
      if (this.players.length === 1) {
        message = '';
      }
      return createElement('div', $t(message));
    }
    if (this.player.players.length > 1 && this.player.waitingFor !== undefined) {
      documentTitleTimer = window.setInterval(() => this.animateTitle(), 1000);
    }
    const input = new PlayerInputFactory().getPlayerInput(createElement, this.players, this.player, this.waitingfor, (out: Array<Array<string>>) => {
      const xhr = new XMLHttpRequest();
      const root = this.$root as unknown as typeof mainAppSettings.data;
      const showAlert = (this.$root as unknown as typeof mainAppSettings.methods).showAlert;
      if (root.isServerSideRequestInProgress) {
        console.warn('Server request in progress');
        return;
      }

      root.isServerSideRequestInProgress = true;
      xhr.open('POST', '/player/input?id=' + this.player.id);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status === 200) {
          root.screen = 'empty';
          root.player = xhr.response;
          root.playerkey++;
          root.screen = 'player-home';
          if (this.player.game.phase === 'end' && window.location.pathname !== '/the-end') {
            (window).location = (window).location;
          }
        } else if (xhr.status === 400 && xhr.responseType === 'json') {
          showAlert(xhr.response.message);
        } else {
          showAlert('Unexpected response from server. Please try again.');
        }
        root.isServerSideRequestInProgress = false;
      };
      xhr.send(JSON.stringify(out));
      xhr.onerror = function() {
        root.isServerSideRequestInProgress = false;
      };
    }, true, true);

    return createElement('div', {'class': 'wf-root'}, [input]);
  },
});

