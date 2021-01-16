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
  methods: {
    isPoliticalAgendasOn: function(): boolean {
      return (this.game !== undefined && this.game.gameOptions.politicalAgendasExtension !== AgendaStyle.STANDARD);
    },
    getBoardColorClass: function(boardName: string): string {
      if (boardName === BoardName.ORIGINAL) {
        return 'game-config board-tharsis';
      } else if (boardName === BoardName.HELLAS) {
        return 'game-config board-hellas';
      } else if (boardName === BoardName.ELYSIUM) {
        return 'game-config board-elysium';
      } else {
        return 'game-config board-other';
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
  },
  template: `
        <div id="game-setup-detail" class="game-setup-detail-container">
          <h1 v-i18n>Game settings</h1>
          <ul>
            <li><div class="setup-item" v-i18n>Expansion:</div>
              <div v-if="game.gameOptions.venusNextExtension" class="create-game-expansion-icon expansion-icon-venus"></div>
              <div v-if="game.gameOptions.preludeExtension" class="create-game-expansion-icon expansion-icon-prelude"></div>
              <div v-if="game.gameOptions.coloniesExtension" class="create-game-expansion-icon expansion-icon-colony"></div>
              <div v-if="game.gameOptions.turmoilExtension" class="create-game-expansion-icon expansion-icon-turmoil"></div>
              <div v-if="game.gameOptions.promoCardsOption" class="create-game-expansion-icon expansion-icon-promo"></div>
              <div v-if="game.gameOptions.aresExtension" class="create-game-expansion-icon expansion-icon-ares"></div>
              <div v-if="game.gameOptions.communityCardsOption" class="create-game-expansion-icon expansion-icon-community"></div>
              <div v-if="isPoliticalAgendasOn()" class="create-game-expansion-icon expansion-icon-agendas"></div>
            </li>
            
            <li><div class="setup-item" v-i18n>Board:</div>
              <span :class="getBoardColorClass(game.gameOptions.boardName)" v-i18n>{{ game.gameOptions.boardName }}</span>
              &nbsp;
              <span v-if="game.gameOptions.shuffleMapOption" class="game-config generic" v-i18n>(randomized tiles)</span>
            </li>
            
            <li><div class="setup-item" v-i18n>WGT:</div>
              <div v-if="game.gameOptions.solarPhaseOption" class="game-config generic" v-i18n>On</div>
              <div v-else class="game-config generic" v-i18n>Off</div>
            </li>
            <li v-if="game.gameOptions.requiresVenusTrackCompletion">Require Terraforming Venus to end the game</li>

            <li><div class="setup-item" v-i18n>Milestones and Awards:</div>
              <span class="game-config generic" v-i18n>{{ getMilestonesAwardsDetail(game.gameOptions) }}</span>
            </li>
            
            <li><div class="setup-item" v-i18n>Draft:</div>
              <div v-if="game.gameOptions.initialDraftVariant" class="game-config generic" v-i18n>Initial</div>
              <div v-if="game.gameOptions.draftVariant" class="game-config generic" v-i18n>Research phase</div>
              <div v-else>Off</div>
            </li>

            <li><div class="setup-item" v-i18n>Game configs:</div>
              <div v-if="game.gameOptions.fastModeOption" class="game-config fastmode" v-i18n>fast mode</div>
              <div v-if="game.gameOptions.showTimers" class="game-config timer" v-i18n>timer</div>
              <div v-if="game.gameOptions.showOtherPlayersVP" class="game-config realtime-vp" v-i18n>real-time vp</div>
              <div v-if="game.gameOptions.undoOption" class="game-config undo" v-i18n>undo</div>
            </li>

            <li><div class="setup-item" v-i18n>Banned cards:</div>{{ game.gameOptions.cardsBlackList.join(', ') }}</li>
          </ul>
        </div>
    `,
});
