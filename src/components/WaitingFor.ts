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
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import {PreferencesManager} from './PreferencesManager';
import {playActivePlayerSound} from '../SoundManager';
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
    'select-colony': SelectColony,
    'select-production-to-lose': SelectProductionToLose,
    'shift-ares-global-parameters': ShiftAresGlobalParameters,
  },
  methods: {
    animateTitle: function() {
      const sequence = '\u25f7\u25f6\u25f5\u25f4';
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
        xhr.open('GET', '/api/waitingfor' + window.location.search + '&prev-game-age=' + this.player.gameAge.toString());
        xhr.onerror = function() {
          alert('Error getting waitingfor data');
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const result = xhr.response as WaitingForModel;
            if (result.result === 'GO') {
              root.updatePlayer();

              if (Notification.permission !== 'granted') {
                Notification.requestPermission();
              }
              if (Notification.permission === 'granted') {
                new Notification(constants.APP_NAME, {
                  icon: '/favicon.ico',
                  body: 'It\'s your turn!',
                });
              }
              const soundsEnabled = PreferencesManager.loadValue('enable_sounds') === '1';
              if (soundsEnabled) playActivePlayerSound();

              // We don't need to wait anymore - it's our turn
              return;
            } else if (result.result === 'REFRESH') {
              // Something changed, let's refresh UI
              root.updatePlayer();

              return;
            }
            vueApp.waitForUpdate();
          } else {
            alert('Unexpected server response');
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
      return createElement('div', $t('Not your turn to take any actions'));
    }
    if (this.player.players.length > 1 && this.player.waitingFor !== undefined) {
      documentTitleTimer = window.setInterval(() => this.animateTitle(), 1000);
    }
    const input = new PlayerInputFactory().getPlayerInput(createElement, this.players, this.player, this.waitingfor, (out: Array<Array<string>>) => {
      const xhr = new XMLHttpRequest();
      const root = this.$root as unknown as typeof mainAppSettings.data;
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
          if (this.player.phase === 'end' && window.location.pathname !== '/the-end') {
            (window).location = (window).location;
          }
        } else if (xhr.status === 400 && xhr.responseType === 'json') {
          const element: HTMLElement | null = document.getElementById('dialog-default');
          const message: HTMLElement | null = document.getElementById('dialog-default-message');
          if (message !== null && element !== null && (element as HTMLDialogElement).showModal !== undefined) {
            message.innerHTML = xhr.response.message;
            (element as HTMLDialogElement).showModal();
          } else {
            alert(xhr.response.message);
          }
        } else {
          alert('Error sending input');
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

