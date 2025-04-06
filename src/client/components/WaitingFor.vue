<template>
  <div>
  <template v-if="waitingfor === undefined">
    {{ $t('Not your turn to take any actions') }}
    <template v-if="playersWaitingFor.length > 0">
      (⌛ <span v-for="color in playersWaitingFor" :class="playerColorClass(color, 'bg')" :key="color">&nbsp;&nbsp;&nbsp;</span>)
    </template>
  </template>
  <div v-else class="wf-root">
    <!-- <template v-if="preferences().experimental_ui && playerView.game.phase === Phase.ACTION && playerView.players.length !== 1"> -->
      <!--
        Autopass is only available when you are taking actions because of how autopass is stored.
        It's connected with when the player takes actions, and is saved along with the rest of the
        game. This means that if you are waiting for someone else to take actions, you can't change
        your autopass setting.

        If there was another database table that stored autopass and other settings, this could be
        changed to be available at all times.
      -->
      <!-- <input type="checkbox" name="autopass" id="autopass-checkbox" v-model="autopass" v-on:change="updateAutopass">
      <label for="autopass-checkbox">
          <span v-i18n>Automatically pass after this action</span>
      </label>
    </template> -->
    <!-- <template v-if="waitingfor !== undefined && waitingfor.showReset && playerView.players.length === 1">
      <div @click="reset">Reset This Action <span class="reset" >(experimental)</span></div>
    </template> -->
    <player-input-factory :players="players"
                          :playerView="playerView"
                          :playerinput="waitingfor"
                          :onsave="onsave"
                          :showsave="true"
                          :showtitle="true" />
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import * as constants from '@/common/constants';
import * as raw_settings from '@/genfiles/settings.json';
import {vueRoot} from '@/client/components/vueRoot';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {playerColorClass} from '@/common/utils/utils';
import {PublicPlayerModel, PlayerViewModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {SoundManager} from '@/client/utils/SoundManager';
import {WaitingForModel} from '@/common/models/WaitingForModel';
import {Phase} from '@/common/Phase';
import {paths} from '@/common/app/paths';
import {statusCode} from '@/common/http/statusCode';
import {isPlayerId} from '@/common/Types';
import {InputResponse} from '@/common/inputs/InputResponse';
import {INVALID_RUN_ID} from '@/common/app/AppErrorId';
import {Color} from '@/common/Color';

let ui_update_timeout_id: number | undefined;
let documentTitleTimer: number | undefined;

type DataModel = {
  waitingForTimeout: typeof raw_settings.waitingForTimeout,
  autopass: boolean,
  playersWaitingFor: Array<Color>
}

export default Vue.extend({
  name: 'waiting-for',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
    settings: {
      type: Object as () => typeof raw_settings,
    },
    waitingfor: {
      type: Object as () => PlayerInputModel | undefined,
    },
  },
  data(): DataModel {
    return {
      waitingForTimeout: this.settings.waitingForTimeout,
      autopass: this.playerView.autopass,
      playersWaitingFor: [],
    };
  },
  methods: {
    animateTitle() {
      const sequence = '\u25D1\u25D2\u25D0\u25D3';
      const first = document.title[0];
      const position = sequence.indexOf(first);
      let next = sequence[0];
      if (position !== -1 && position < sequence.length - 1) {
        next = sequence[position + 1];
      }
      document.title = next + ' ' + this.$t(constants.APP_NAME);
    },
    // TODO(kberg): use loadPlayerViewResponse.
    onsave(out: InputResponse) {
      const xhr = new XMLHttpRequest();
      const root = vueRoot(this);
      const showAlert = root.showAlert;

      if (root.isServerSideRequestInProgress) {
        console.warn('Server request in progress');
        return;
      }

      root.isServerSideRequestInProgress = true;
      xhr.open('POST', paths.PLAYER_INPUT + '?id=' + this.playerView.id);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status === statusCode.ok) {
          root.screen = 'empty';
          root.playerView = xhr.response;
          root.playerkey++;
          root.screen = 'player-home';
          if (this.playerView.game.phase === 'end' && window.location.pathname !== paths.THE_END) {
            (window).location = (window).location; // eslint-disable-line no-self-assign
          }
        } else if (xhr.status === statusCode.badRequest && xhr.responseType === 'json') {
          if (xhr.response.id === INVALID_RUN_ID) {
            showAlert(xhr.response.message, () => {
              setTimeout(() => window.location.reload(), 100);
            });
          } else {
            showAlert(xhr.response.message);
          }
        } else {
          showAlert('Unexpected response from server. Please try again.');
        }
        root.isServerSideRequestInProgress = false;
      };
      xhr.send(JSON.stringify({runId: this.playerView.runId, ...out}));
      xhr.onerror = function() {
        // todo(kberg): Report error to caller
        root.isServerSideRequestInProgress = false;
      };
    },
    reset() {
      const xhr = new XMLHttpRequest();
      const root = vueRoot(this);
      if (root.isServerSideRequestInProgress) {
        console.warn('Server request in progress');
        return;
      }

      root.isServerSideRequestInProgress = true;
      xhr.open('GET', paths.RESET + '?id=' + this.playerView.id);
      xhr.responseType = 'json';
      xhr.onload = () => {
        this.loadPlayerViewResponse(xhr);
      };
      xhr.send();
      xhr.onerror = function() {
        // todo(kberg): Report error to caller
        root.isServerSideRequestInProgress = false;
      };
    },
    updateAutopass() {
      const xhr = new XMLHttpRequest();
      const root = vueRoot(this);
      if (root.isServerSideRequestInProgress) {
        console.warn('Server request in progress');
        return;
      }
      xhr.onload = () => {
        root.isServerSideRequestInProgress = true;
      };
      xhr.open('GET', paths.AUTOPASS + '?id=' + this.playerView.id + '&autopass=' + this.autopass);
      xhr.responseType = 'json';
      xhr.send();
      xhr.onerror = function() {
        // todo(kberg): Report error to caller
        root.isServerSideRequestInProgress = false;
      };
    },
    loadPlayerViewResponse(xhr: XMLHttpRequest) {
      const root = vueRoot(this);
      const showAlert = vueRoot(this).showAlert;
      if (xhr.status === 200) {
        root.screen = 'empty';
        root.playerView = xhr.response;
        root.playerkey++;
        root.screen = 'player-home';
        if (this.playerView.game.phase === 'end' && window.location.pathname !== paths.THE_END) {
          (window).location = (window).location; // eslint-disable-line no-self-assign
        }
      } else if (xhr.status === statusCode.badRequest && xhr.responseType === 'json') {
        showAlert(xhr.response.message);
      } else {
        showAlert('Unexpected response from server. Please try again.');
      }
      root.isServerSideRequestInProgress = false;
    },

    waitForUpdate() {
      const vueApp = this;
      const root = vueRoot(this);
      clearTimeout(ui_update_timeout_id);
      const askForUpdate = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', paths.API_WAITING_FOR + window.location.search + '&gameAge=' + this.playerView.game.gameAge + '&undoCount=' + this.playerView.game.undoCount);
        xhr.onerror = function() {
          root.showAlert('Unable to reach the server. The server may be restarting or down for maintenance.', () => vueApp.waitForUpdate());
        };
        xhr.onload = () => {
          if (xhr.status === statusCode.ok) {
            const result = xhr.response as WaitingForModel;
            this.playersWaitingFor = result.waitingFor;
            if (result.result === 'GO') {
              // Will only apply to player, not spectator.
              root.updatePlayer();
              this.notify();
              // We don't need to wait anymore - it's our turn
              return;
            } else if (result.result === 'REFRESH') {
              // Something changed, let's refresh UI
              if (isPlayerId(this.playerView.id)) {
                root.updatePlayer();
              } else {
                root.updateSpectator();
              }

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
    notify() {
      if (getPreferences().enable_sounds) {
        SoundManager.playActivePlayerSound();
      }

      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      } else if (Notification.permission === 'granted') {
        const notificationOptions = {
          icon: 'favicon.ico',
          body: 'It\'s your turn!',
        };
        const notificationTitle = constants.APP_NAME;
        try {
          new Notification(notificationTitle, notificationOptions);
        } catch (e) {
          // ok so the native Notification doesn't work which will happen
          // try to use the service worker
          if (!window.isSecureContext || !navigator.serviceWorker) {
            return;
          }
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(notificationTitle, notificationOptions);
          }).catch((err) => {
            // avoid promise going uncaught
            console.warn('Failed to display notification with serviceWorker', err);
          });
        }
      }
    },
  },
  mounted() {
    document.title = this.$t(constants.APP_NAME);
    window.clearInterval(documentTitleTimer);
    if (this.waitingfor === undefined) {
      this.waitForUpdate();
    }
    if (this.playerView.players.length > 1 && this.waitingfor !== undefined) {
      documentTitleTimer = window.setInterval(() => this.animateTitle(), 1000);
    }
  },
  computed: {
    Phase(): typeof Phase {
      return Phase;
    },
    preferences(): typeof getPreferences {
      return getPreferences;
    },
    playerColorClass(): typeof playerColorClass {
      return playerColorClass;
    },
  },
});

</script>

