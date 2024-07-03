import GameEnd from '@/client/components/GameEnd.vue';
import CreateGameForm from '@/client/components/create/CreateGameForm.vue';
import GameHome from '@/client/components/GameHome.vue';
import GamesOverview from '@/client/components/GamesOverview.vue';
import PlayerHome from '@/client/components/PlayerHome.vue';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';
import SpectatorHome from '@/client/components/SpectatorHome.vue';
import {ViewModel, PlayerViewModel} from '@/common/models/PlayerModel';
import StartScreen from '@/client/components/StartScreen.vue';
import LoadGameForm from '@/client/components/LoadGameForm.vue';
import CardList from '@/client/components/cardlist/CardList.vue';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import Help from '@/client/components/help/Help.vue';
import AdminHome from '@/client/components/admin/AdminHome.vue';

import {$t, setTranslationContext} from '@/client/directives/i18n';

import * as constants from '@/common/constants';
import * as raw_settings from '@/genfiles/settings.json';
import {paths} from '@/common/app/paths';
import {SpectatorModel} from '@/common/models/SpectatorModel';
import {isPlayerId, isSpectatorId} from '@/common/Types';
import {hasShowModal, showModal, windowHasHTMLDialogElement} from './HTMLDialogElementCompatibility';
import {statusCode} from '@/common/http/statusCode';

const dialogPolyfill = require('dialog-polyfill');

export interface MainAppData {
    screen: 'admin' |
            'create-game-form' |
            'cards' |
            'empty' |
            'game-home' |
            'games-overview' |
            'help' |
            'load' |
            'player-home' |
            'spectator-home' |
            'start-screen' |
            'the-end';
    /**
     * player or spectator are set once the app component has loaded.
     * Vue only watches properties that exist initially. When we
     * use this property we can't trigger vue state without
     * a refactor.
     */
    spectator?: SpectatorModel;
    playerView?: PlayerViewModel;
    // playerKey might seem to serve no function, but it's basically an arbitrary value used
    // to force a rerender / refresh.
    // See https://michaelnthiessen.com/force-re-render/
    playerkey: number;
    settings: typeof raw_settings;
    isServerSideRequestInProgress: boolean;
    componentsVisibility: {[x: string]: boolean};
    game: SimpleGameModel | undefined;
}

export const mainAppSettings = {
  'el': '#app',
  'data': {
    screen: 'empty',
    playerkey: 0,
    settings: raw_settings,
    isServerSideRequestInProgress: false,
    componentsVisibility: {
      'milestones': true,
      'awards_list': true,
      'tags_concise': false,
      'pinned_player_0': false,
      'pinned_player_1': false,
      'pinned_player_2': false,
      'pinned_player_3': false,
      'pinned_player_4': false,
      'turmoil_parties': false,
    } as {[x: string]: boolean},
    game: undefined as SimpleGameModel | undefined,
    playerView: undefined,
    spectator: undefined,
    logPaused: false,
  } as MainAppData,
  'components': {
    // These component keys match the screen values, and their entries in index.html.
    'player-input-factory': PlayerInputFactory,
    'start-screen': StartScreen,
    'create-game-form': CreateGameForm,
    'load-game-form': LoadGameForm,
    'game-home': GameHome,
    'player-home': PlayerHome,
    'spectator-home': SpectatorHome,
    'game-end': GameEnd,
    'games-overview': GamesOverview,
    'card-list': CardList,
    'help': Help,
    'admin-home': AdminHome,
  },
  'methods': {
    showAlert(message: string, cb: () => void = () => {}): void {
      const dialogElement: HTMLElement | null = document.getElementById('alert-dialog');
      const buttonElement: HTMLElement | null = document.getElementById('alert-dialog-button');
      const messageElement: HTMLElement | null = document.getElementById('alert-dialog-message');
      if (buttonElement !== null && messageElement !== null && dialogElement !== null && hasShowModal(dialogElement)) {
        messageElement.innerHTML = $t(message);
        const handler = () => {
          buttonElement.removeEventListener('click', handler);
          cb();
        };
        buttonElement.addEventListener('click', handler);
        showModal(dialogElement);
      } else {
        alert(message);
        cb();
      }
    },
    setVisibilityState(targetVar: string, isVisible: boolean) {
      if (isVisible === this.getVisibilityState(targetVar)) return;
      (this as unknown as MainAppData).componentsVisibility[targetVar] = isVisible;
    },
    getVisibilityState(targetVar: string): boolean {
      return (this as unknown as MainAppData).componentsVisibility[targetVar] ? true : false;
    },
    update(path: typeof paths.PLAYER | typeof paths.SPECTATOR): void {
      const currentPathname = getLastPathSegment();
      const xhr = new XMLHttpRequest();
      const app = this as unknown as MainAppData;

      const url = 'api/' + path + window.location.search.replace('&noredirect', '');
      xhr.open('GET', url);
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = function() {
        try {
          if (xhr.status === statusCode.ok) {
            const model = xhr.response as ViewModel;
            if (path === paths.PLAYER) {
              app.playerView = model as PlayerViewModel;
              setTranslationContext(app.playerView);
            } else if (path === paths.SPECTATOR) {
              app.spectator = model as SpectatorModel;
            }
            app.playerkey++;
            if (
              model.game.phase === 'end' &&
              window.location.search.includes('&noredirect') === false
            ) {
              app.screen = 'the-end';
              if (currentPathname !== paths.THE_END) {
                window.history.replaceState(
                  xhr.response,
                  `${constants.APP_NAME} - Player`,
                  `${paths.THE_END}?id=${model.id}`,
                );
              }
            } else {
              if (path === paths.PLAYER) {
                app.screen = 'player-home';
              } else if (path === paths.SPECTATOR) {
                app.screen = 'spectator-home';
              }
              if (currentPathname !== path) {
                window.history.replaceState(
                  xhr.response,
                  `${constants.APP_NAME} - Game`,
                  `${path}?id=${model.id}`,
                );
              }
            }
          } else {
            alert('Unexpected server response: ' + xhr.statusText);
          }
        } catch (e) {
          console.log('Error processing XHR response: ' + e);
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    },
    updatePlayer() {
      this.update(paths.PLAYER);
    },
    updateSpectator: function() {
      this.update(paths.SPECTATOR);
    },
  },
  mounted() {
    document.title = constants.APP_NAME;
    if (!windowHasHTMLDialogElement()) dialogPolyfill.default.registerDialog(document.getElementById('alert-dialog'));
    const currentPathname = getLastPathSegment();
    const app = this as unknown as (MainAppData) & (typeof mainAppSettings.methods);
    if (currentPathname === paths.PLAYER) {
      app.updatePlayer();
    } else if (currentPathname === paths.THE_END) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id') || '';
      if (isPlayerId(id)) {
        app.updatePlayer();
      } else if (isSpectatorId(id)) {
        app.updateSpectator();
      } else {
        alert('Bad id URL parameter.');
      }
    } else if (currentPathname === paths.GAME) {
      app.screen = 'game-home';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', paths.API_GAME + window.location.search);
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = function() {
        if (xhr.status === statusCode.ok) {
          window.history.replaceState(
            xhr.response,
            `${constants.APP_NAME} - Game`,
            `${paths.GAME}?id=${xhr.response.id}`,
          );
          app.game = xhr.response as SimpleGameModel;
        } else {
          alert('Unexpected server response');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    } else if (currentPathname === paths.GAMES_OVERVIEW) {
      app.screen = 'games-overview';
    } else if (currentPathname === paths.NEW_GAME) {
      app.screen = 'create-game-form';
    } else if (currentPathname === paths.LOAD) {
      app.screen = 'load';
    } else if (currentPathname === paths.CARDS) {
      app.screen = 'cards';
    } else if (currentPathname === paths.HELP) {
      app.screen = 'help';
    } else if (currentPathname === paths.SPECTATOR) {
      app.updateSpectator();
    } else if (currentPathname === paths.ADMIN) {
      app.screen = 'admin';
    } else {
      app.screen = 'start-screen';
    }
  },
};

// NOTE: this simplistic truncation to the last segment might cause issues if
// this page starts supporting paths more than one level deep.
function getLastPathSegment() {
  // Leave only the last part of /path
  return window.location.pathname.replace(/.*\//g, '');
}
