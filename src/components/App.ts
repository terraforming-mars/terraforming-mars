import GameEnd from '@/components/GameEnd.vue';
import CreateGameForm from '@/components/create/CreateGameForm.vue';
import GameHome from '@/components/GameHome.vue';
import GamesOverview from '@/components/GamesOverview.vue';
import PlayerHome from '@/components/PlayerHome.vue';
import PlayerInputFactory from '@/components/PlayerInputFactory.vue';
import SpectatorHome from '@/components/SpectatorHome.vue';
import {AppModel, PlayerViewModel} from '@/models/PlayerModel';
import StartScreen from '@/components/StartScreen.vue';
import LoadGameForm from '@/components/LoadGameForm.vue';
import DebugUI from '@/components/DebugUI.vue';
import {SimpleGameModel} from '@/models/SimpleGameModel';
import Help from '@/components/help/Help.vue';

import {$t} from '@/directives/i18n';

import * as constants from '@/constants';
import * as raw_settings from '@/genfiles/settings.json';
import {SpectatorModel} from '@/models/SpectatorModel';

const dialogPolyfill = require('dialog-polyfill');

interface MainAppData {
    screen: 'create-game-form' |
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
      'milestones_list': true,
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
    'debug-ui': DebugUI,
    'help': Help,
  },
  'methods': {
    showAlert(message: string, cb: () => void = () => {}): void {
      const dialogElement: HTMLElement | null = document.getElementById('alert-dialog');
      const buttonElement: HTMLElement | null = document.getElementById('alert-dialog-button');
      const messageElement: HTMLElement | null = document.getElementById('alert-dialog-message');
      if (buttonElement !== null && messageElement !== null && dialogElement !== null && (dialogElement as HTMLDialogElement).showModal !== undefined) {
        messageElement.innerHTML = $t(message);
        const handler = () => {
          buttonElement.removeEventListener('click', handler);
          cb();
        };
        buttonElement.addEventListener('click', handler);
        (dialogElement as HTMLDialogElement).showModal();
      } else {
        alert(message);
        cb();
      }
    },
    setVisibilityState(targetVar: string, isVisible: boolean) {
      if (isVisible === this.getVisibilityState(targetVar)) return;
      (this as unknown as typeof mainAppSettings.data).componentsVisibility[targetVar] = isVisible;
    },
    getVisibilityState(targetVar: string): boolean {
      return (this as unknown as typeof mainAppSettings.data).componentsVisibility[targetVar] ? true : false;
    },
    updateX(path: '/player' | '/spectator'): void {
      const currentPathname: string = window.location.pathname;
      const xhr = new XMLHttpRequest();
      const app = this as unknown as typeof mainAppSettings.data;

      const url = '/api' + path + window.location.search.replace('&noredirect', '');
      xhr.open('GET', url);
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = function() {
        try {
          if (xhr.status === 200) {
            const model = xhr.response as AppModel;
            if (path === '/player') {
              console.log('updating player');
              app.playerView = model as PlayerViewModel;
            } else if (path === '/spectator') {
              console.log('spectator');
              app.spectator = model as SpectatorModel;
            }
            app.playerkey++;
            if (
              model.game.phase === 'end' &&
              window.location.search.includes('&noredirect') === false
            ) {
              app.screen = 'the-end';
              if (currentPathname !== '/the-end') {
                window.history.replaceState(
                  xhr.response,
                  `${constants.APP_NAME} - Player`,
                  '/the-end?id=' + model.id,
                );
              }
            } else {
              if (path === '/player') {
                app.screen = 'player-home';
              } else if (path === '/spectator') {
                app.screen = 'spectator-home';
              }
              if (currentPathname !== path) {
                window.history.replaceState(
                  xhr.response,
                  `${constants.APP_NAME} - Game`,
                  path + '?id=' + model.id,
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
      this.updateX('/player');
    },
    updateSpectator: function() {
      this.updateX('/spectator');
    },
  },
  mounted() {
    document.title = constants.APP_NAME;
    if (!window.HTMLDialogElement) dialogPolyfill.default.registerDialog(document.getElementById('alert-dialog'));
    const currentPathname: string = window.location.pathname;
    const app = this as unknown as (typeof mainAppSettings.data) & (typeof mainAppSettings.methods);
    if (currentPathname === '/player' || currentPathname === '/the-end') {
      app.updatePlayer();
    } else if (currentPathname === '/game') {
      app.screen = 'game-home';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/game' + window.location.search);
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = function() {
        if (xhr.status === 200) {
          window.history.replaceState(
            xhr.response,
            `${constants.APP_NAME} - Game`,
            '/game?id=' + xhr.response.id,
          );
          app.game = xhr.response as SimpleGameModel;
        } else {
          alert('Unexpected server response');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    } else if (currentPathname === '/games-overview') {
      app.screen = 'games-overview';
    } else if (
      currentPathname === '/new-game' || currentPathname === '/solo'
    ) {
      app.screen = 'create-game-form';
    } else if (currentPathname === '/load') {
      app.screen = 'load';
    } else if (currentPathname === '/cards') {
      app.screen = 'cards';
    } else if (currentPathname === '/help') {
      app.screen = 'help';
    } else if (currentPathname === '/spectator') {
      app.updateSpectator();
    } else {
      app.screen = 'start-screen';
    }
  },
};
