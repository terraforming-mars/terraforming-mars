import Vue from 'vue';
import {GameOptions} from '../Game';
import {GameHomeModel} from '../models/GameHomeModel';
import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';

export const GameSetupDetail = Vue.component('game-setup-detail', {
  props: {
    game: {
      type: Object as () => GameHomeModel | undefined,
    },
  },
  methods: {isPoliticalAgendasOn: function(): boolean {
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
        <div id="game-setup-detail" class="game-setup-detail-container">
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
    `,
});
