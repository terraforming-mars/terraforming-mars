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
    getSoloDetail: function(gameOptions: GameOptions): string {
      if (this.game !== undefined && this.game.players.length !== 1) return '';

      if (gameOptions.soloTR) {
        return '<div>Solo mode: 63 TR</div>';
      } else {
        return '<div>Solo mode: All parameters</div>';
      }
    },
    getExpansionIcons: function(gameOptions: GameOptions): string {
      let expansionIcons = 'Expansion: ';
      if (gameOptions.venusNextExtension) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-venus"></div>';
      }
      if (gameOptions.preludeExtension) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-prelude"></div>';
      }
      if (gameOptions.coloniesExtension) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-colony"></div>';
      }
      if (gameOptions.turmoilExtension) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-turmoil"></div>';
      }
      if (gameOptions.promoCardsOption) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-promo"></div>';
      }
      if (gameOptions.aresExtension) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-ares"></div>';
      }
      if (gameOptions.communityCardsOption) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-community"></div>';
      }
      if (gameOptions.politicalAgendasExtension !== AgendaStyle.STANDARD) {
        expansionIcons += '<div class="create-game-expansion-icon expansion-icon-agendas"></div>';
      }
      return expansionIcons;
    },
    getBoardDetail: function(gameOptions: GameOptions): string {
      let boardDetail = 'Board: ';
      if (gameOptions.boardName === BoardName.ORIGINAL) {
        boardDetail += '<div class="create-game-board-hexagon create-game-tharsis">&#x2B22;</div>' + gameOptions.boardName;
      } else if (gameOptions.boardName === BoardName.HELLAS) {
        boardDetail += '<div class="create-game-board-hexagon create-game-hellas">&#x2B22;</div>' + gameOptions.boardName;
      } else if (gameOptions.boardName === BoardName.ELYSIUM) {
        boardDetail += '<div class="create-game-board-hexagon create-game-elysium">&#x2B22;</div>' + gameOptions.boardName;
      } else {
        boardDetail += gameOptions.boardName;
      }
      if (gameOptions.shuffleMapOption) {
        boardDetail += ' (randomized tiles)';
      }
      return boardDetail;
    },
    getVenusDetail: function(gameOptions: GameOptions): string {
      let venusDetail = '';
      if (gameOptions.solarPhaseOption) {
        venusDetail += '<div>WGT: On</div>';
      } else {
        venusDetail += '<div>WGT: Off</div>';
      }
      if (gameOptions.requiresVenusTrackCompletion) {
        venusDetail += '<div>Require Terraforming Venus to end the game</div>';
      }
      return venusDetail;
    },
    getMilestonesAwardsDetail: function(gameOptions: GameOptions): string {
      if (this.game !== undefined && this.game.players.length === 1) return '';
      let MAtype = '';
      if (gameOptions.randomMA === RandomMAOptionType.NONE) {
        if (gameOptions.includeVenusMA) {
          MAtype = 'Board-defined + Hoverlord & Venuphile';
        } else {
          MAtype = 'Board-defined';
        }
      } else if (gameOptions.randomMA === RandomMAOptionType.LIMITED) {
        if (gameOptions.includeVenusMA) {
          MAtype = 'Limited-synergy randomized (6 each)';
        } else {
          MAtype = 'Limited-synergy randomized (5 each)';
        }
      } else {
        if (gameOptions.includeVenusMA) {
          MAtype = 'Fully randomized (6 each)';
        } else {
          MAtype = 'Fully randomized (5 each)';
        }
      }
      return `<div>Milestones and Awards: ${MAtype}</div>`;
    },
    getDraftDetail: function(gameOptions: GameOptions): string {
      let draftType = '';
      if (gameOptions.draftVariant && gameOptions.initialDraftVariant) {
        draftType = 'Initial + Research phase';
      } else if (gameOptions.draftVariant && !gameOptions.initialDraftVariant) {
        draftType = 'Draft: Research phase only';
      } else {
        draftType = 'Off';
      }
      return `Draft: ${draftType}`;
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
      return (configsDetail.length !== 0) ? 'Game configs: ' + configsDetail.join(', ') : '';
    },
    getBannedCards: function(gameOptions: GameOptions): string {
      if (gameOptions.cardsBlackList.length === 0) {
        return '';
      } else {
        return 'Banned cards: ' + gameOptions.cardsBlackList.join(', ');
      }
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
          <div v-html="getSoloDetail(game.gameOptions)"></div>
          <div v-html="getExpansionIcons(game.gameOptions)"></div>
          <div v-html="getBoardDetail(game.gameOptions)"></div>
          <div v-html="getMilestonesAwardsDetail(game.gameOptions)"></div>
          <div v-html="getVenusDetail(game.gameOptions)"></div>
          <div v-html="getDraftDetail(game.gameOptions)"></div>
          <div v-html="getGameConfigs(game.gameOptions)"></div>
          <div v-html="getBannedCards(game.gameOptions)"></div>
        </div>
      </div>
    `,
});
