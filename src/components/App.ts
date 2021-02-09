import {GameEnd} from './GameEnd';
import {CreateGameForm} from './CreateGameForm';
import {GameHome} from './GameHome';
import {GamesOverview} from './GamesOverview';
import {PlayerHome} from './PlayerHome';
import {PlayerModel} from '../models/PlayerModel';
import {StartScreen} from './StartScreen';
import {LoadGameForm} from './LoadGameForm';
import {DebugUI} from './DebugUI';
import {GameHomeModel} from '../models/GameHomeModel';
import {HelpIconology} from './HelpIconology';

import * as constants from '../constants';
import * as raw_settings from '../genfiles/settings.json';

interface MainAppData {
    screen: 'create-game-form' |
            'debug-ui' |
            'empty' |
            'game-home' |
            'games-overview' |
            'help-iconology' |
            'load' |
            'player-home' |
            'start-screen' |
            'the-end';
    /**
     * We set player once the app component has loaded. Vue only
     * watches properties that exist initially. When we
     * use this property we can't trigger vue state without
     * a refactor.
     */
    player?: PlayerModel;
    playerkey: number;
    settings: typeof raw_settings;
    isServerSideRequestInProgress: boolean;
    componentsVisibility: {[x: string]: boolean};
    game: GameHomeModel | undefined;
}

export const mainAppSettings = {
  'el': '#app',
  'data': {
    screen: 'empty',
    playerkey: 0,
    settings: raw_settings,
    isServerSideRequestInProgress: false,
    componentsVisibility: {
      'millestones_list': true,
      'awards_list': true,
      'tags_concise': false,
      'pinned_player_0': false,
      'pinned_player_1': false,
      'pinned_player_2': false,
      'pinned_player_3': false,
      'pinned_player_4': false,
      'turmoil_parties': false,
    } as {[x: string]: boolean},
    game: undefined as GameHomeModel | undefined,
  } as MainAppData,
  'components': {
    'start-screen': StartScreen,
    'create-game-form': CreateGameForm,
    'load-game-form': LoadGameForm,
    'game-home': GameHome,
    'player-home': PlayerHome,
    'player-end': GameEnd,
    'games-overview': GamesOverview,
    'debug-ui': DebugUI,
    'help-iconology': HelpIconology,
  },
  'methods': {
    setVisibilityState: function(targetVar: string, isVisible: boolean) {
      if (isVisible === this.getVisibilityState(targetVar)) return;
      (this as unknown as typeof mainAppSettings.data).componentsVisibility[targetVar] = isVisible;
    },
    getVisibilityState: function(targetVar: string): boolean {
      return (this as unknown as typeof mainAppSettings.data).componentsVisibility[targetVar] ? true : false;
    },
    updatePlayer: function() {
      const currentPathname: string = window.location.pathname;
      const xhr = new XMLHttpRequest();
      const app = this as unknown as typeof mainAppSettings.data;
      xhr.open(
        'GET',
        '/api/player' +
                    window.location.search.replace('&noredirect', ''),
      );
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          app.player = xhr.response as PlayerModel;
          app.playerkey++;
          if (
            app.player.phase === 'end' &&
                        window.location.search.includes('&noredirect') === false
          ) {
            app.screen = 'the-end';
            if (currentPathname !== '/the-end') {
              window.history.replaceState(
                xhr.response,
                `${constants.APP_NAME} - Player`,
                '/the-end?id=' + app.player.id,
              );
            }
          } else {
            app.screen = 'player-home';
            if (currentPathname !== '/player') {
              window.history.replaceState(
                xhr.response,
                `${constants.APP_NAME} - Game`,
                '/player?id=' + app.player.id,
              );
            }
          }
        } else {
          alert('Unexpected server response');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    },
  },
  'mounted': function() {
    document.title = constants.APP_NAME;
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
      xhr.onload = () => {
        if (xhr.status === 200) {
          window.history.replaceState(
            xhr.response,
            `${constants.APP_NAME} - Game`,
            '/game?id=' + xhr.response.id,
          );
          app.game = xhr.response as GameHomeModel;
        } else {
          alert('Unexpected server response');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    } else if (currentPathname === '/games-overview') {
      app.screen = 'games-overview';
    } else if (
      currentPathname === '/new-game' ||
            currentPathname === '/solo'
    ) {
      app.screen = 'create-game-form';
    } else if (currentPathname === '/load') {
      app.screen = 'load';
    } else if (currentPathname === '/debug-ui') {
      app.screen = 'debug-ui';
    } else if (currentPathname === '/help-iconology') {
      app.screen = 'help-iconology';
    } else {
      app.screen = 'start-screen';
    }
  },
};
