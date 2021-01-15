import Vue from 'vue';
import {GameHomeModel} from '../models/GameHomeModel';
import {Button} from '../components/common/Button';
import {playerColorClass} from '../utils/utils';
import {BoardName} from '../boards/BoardName';
import {GameOptions} from '../Game';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';

// taken from https://stackoverflow.com/a/46215202/83336
// The solution to copying to the clipboard in this case is
// 1. create a dummy input
// 2. add the copied text as a value
// 3. select the input
// 4. execute document.execCommand('copy') which does the clipboard thing
// 5. remove the dummy input
function copyToClipboard(text: string): void {
  const input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}
const DEFAULT_COPIED_PLAYER_ID = '-1';

export const GameHome = Vue.component('game-home', {
  props: {
    game: {
      type: Object as () => GameHomeModel | undefined,
    },
  },
  components: {
    Button,
  },
  data: function() {
    return {
      // Variable to keep the state for the current copied player id. Used to display message of which button and which player playable link is currently in the clipboard
      urlCopiedPlayerId: DEFAULT_COPIED_PLAYER_ID as string,
    };
  },
  methods: {
    getGameId: function(): string {
      return this.game !== undefined ? this.game.id.toString() : 'n/a';
    },
    getTurnOrder: function(index: number): string {
      if (index === 0) {
        return '1st';
      } else if (index === 1) {
        return '2nd';
      } else if (index === 2) {
        return '3rd';
      } else if (index > 2) {
        return `${index + 1}th`;
      } else {
        return 'n/a';
      }
    },
    setCopiedIdToDefault: function() {
      this.urlCopiedPlayerId = DEFAULT_COPIED_PLAYER_ID;
    },
    getPlayerCubeColorClass: function(color: string): string {
      return playerColorClass(color.toLowerCase(), 'bg');
    },
    getHref: function(playerId: string): string {
      return `/player?id=${playerId}`;
    },
    copyUrl: function(playerId: string): void {
      copyToClipboard(window.location.host + this.getHref(playerId));
      this.urlCopiedPlayerId = playerId;
    },
    isPlayerUrlCopied: function(playerId: string): boolean {
      return playerId === this.urlCopiedPlayerId;
    },
    isPoliticalAgendasOn: function() {
      return (this.game !== undefined && this.game.gameOptions.politicalAgendasExtension !== AgendaStyle.STANDARD);
    },
    getBoardColorClass: function(boardName: string): string {
      if (boardName === BoardName.ORIGINAL) {
        return 'create-game-board-hexagon create-game-tharsis';
      } else if (boardName === BoardName.HELLAS) {
        return 'create-game-board-hexagon create-game-hellas';
      } else if (boardName === BoardName.ELYSIUM) {
        return 'create-game-board-hexagon create-game-elysium';
      } else {
        return 'create-game-board-hexagon create-game-random';
      }
    },
    getMilestonesAwardsDetail: function(gameOptions: GameOptions): string {
      if (this.game !== undefined && this.game.players.length === 1) return 'N/A';
      if (gameOptions.randomMA === RandomMAOptionType.NONE) {
        if (gameOptions.includeVenusMA) {
          return 'Board-defined + Hoverlord & Venuphile';
        } else {
          return 'Board-defined';
        }
      } else if (gameOptions.randomMA === RandomMAOptionType.LIMITED) {
        if (gameOptions.includeVenusMA) {
          return 'Limited-synergy randomized (6 each)';
        } else {
          return 'Limited-synergy randomized (5 each)';
        }
      } else {
        if (gameOptions.includeVenusMA) {
          return 'Fully randomized (6 each)';
        } else {
          return 'Fully randomized (5 each)';
        }
      }
    },
    getGameConfigs: function(gameOptions: GameOptions): string {
      const configsDetail: Array<string> = [];
      if (gameOptions.fastModeOption) {
        configsDetail.push('fast mode');
      }
      if (gameOptions.showTimers) {
        configsDetail.push('timer');
      }
      if (gameOptions.showOtherPlayersVP) {
        configsDetail.push('real-time vp');
      }
      if (gameOptions.undoOption) {
        configsDetail.push('undo');
      }
      return (configsDetail.length !== 0) ? configsDetail.join(', ') : '';
    },
  },
  template: `
      <div id="game-home" class="game-home-container">
        <h1><span v-i18n>Terraforming mars</span> [game id: <span>{{getGameId()}}</span>]</h1>
        <h4 v-i18n>Instructions: To start the game, separately copy and share the links with all players, and then click on your name. <br/>Save this page in case you or one of your opponents loses a link.</h4>
        <ul>
          <li v-for="(player, index) in (game === undefined ? [] : game.players)">
            <span class="turn-order">{{getTurnOrder(index)}}</span>
            <span :class="'color-square ' + getPlayerCubeColorClass(player.color)"></span>
            <span class="player-name"><a :href="getHref(player.id)">{{player.name}}</a></span>
            <Button title="copy" size="tiny" :onClick="_=>copyUrl(player.id)"/>
            <span v-if="isPlayerUrlCopied(player.id)" class="copied-notice">Playable link for {{player.name}} copied to clipboard <span class="dismissed" @click="setCopiedIdToDefault" >dismiss</span></span>
          </li>
        </ul>
        <br>
        <div v-if="game !== undefined">
          
        <h2>Game settings</h2>
          <div>Expansion:
            <div v-if="game.gameOptions.venusNextExtension" class="create-game-expansion-icon expansion-icon-venus"></div>
            <div v-if="game.gameOptions.preludeExtension" class="create-game-expansion-icon expansion-icon-prelude"></div>
            <div v-if="game.gameOptions.coloniesExtension" class="create-game-expansion-icon expansion-icon-colony"></div>
            <div v-if="game.gameOptions.turmoilExtension" class="create-game-expansion-icon expansion-icon-turmoil"></div>
            <div v-if="game.gameOptions.promoCardsOption" class="create-game-expansion-icon expansion-icon-promo"></div>
            <div v-if="game.gameOptions.aresExtension" class="create-game-expansion-icon expansion-icon-ares"></div>
            <div v-if="game.gameOptions.communityCardsOption" class="create-game-expansion-icon expansion-icon-community"></div>
            <div v-if="isPoliticalAgendasOn()" class="create-game-expansion-icon expansion-icon-agendas"></div>
          </div>
          
          <div>Board:
            <span>{{ game.gameOptions.boardName }}</span>
            <span v-if="game.gameOptions.shuffleMapOption" >&nbsp;(randomized tiles)</span>
            <span :class="getBoardColorClass(game.gameOptions.boardName)">&#x2B22;</span>
          </div>
          
          <div v-if="game.gameOptions.solarPhaseOption">WGT: On</div>
          <div v-else>WGT: Off</div>
          <div v-if="game.gameOptions.requiresVenusTrackCompletion">Require Terraforming Venus to end the game</div>

          <div>Milestones and Awards: <span>{{ getMilestonesAwardsDetail(game.gameOptions) }}</span></div>
          
          <div>Draft:
            <span v-if="game.gameOptions.draftVariant && game.gameOptions.initialDraftVariant">Initial + Research phase</span>
            <span v-else-if="game.gameOptions.draftVariant && !game.gameOptions.initialDraftVariant">Research phase only</span>
            <span v-else>Off</span>
          </div>

          <div>Game configs: {{ getGameConfigs(game.gameOptions) }}</div>

          <div>Banned cards: {{ game.gameOptions.cardsBlackList.join(', ') }}</div>
        </div>
      </div>
    `,
});
