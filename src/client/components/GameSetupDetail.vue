<template>
        <div id="game-setup-detail" class="game-setup-detail-container">
          <ul>
            <li><div class="setup-item" v-i18n>Expansion:</div>
              <div v-if="gameOptions.venusNextExtension" class="create-game-expansion-icon expansion-icon-venus"></div>
              <div v-if="gameOptions.preludeExtension" class="create-game-expansion-icon expansion-icon-prelude"></div>
              <div v-if="gameOptions.coloniesExtension" class="create-game-expansion-icon expansion-icon-colony"></div>
              <div v-if="gameOptions.turmoilExtension" class="create-game-expansion-icon expansion-icon-turmoil"></div>
              <div v-if="gameOptions.promoCardsOption" class="create-game-expansion-icon expansion-icon-promo"></div>
              <div v-if="gameOptions.aresExtension" class="create-game-expansion-icon expansion-icon-ares"></div>
              <div v-if="gameOptions.moonExpansion" class="create-game-expansion-icon expansion-icon-themoon"></div>
              <div v-if="gameOptions.pathfindersExpansion" class="create-game-expansion-icon expansion-icon-pathfinders"></div>
              <div v-if="gameOptions.communityCardsOption" class="create-game-expansion-icon expansion-icon-community"></div>
              <div v-if="isPoliticalAgendasOn()" class="create-game-expansion-icon expansion-icon-agendas"></div>
            </li>

            <li><div class="setup-item" v-i18n>Board:</div>
              <span :class="getBoardColorClass(gameOptions.boardName)" v-i18n>{{ gameOptions.boardName }}</span>
              &nbsp;
              <span v-if="gameOptions.shuffleMapOption" class="game-config generic" v-i18n>(randomized tiles)</span>
            </li>

            <li><div class="setup-item" v-i18n>WGT:</div>
              <div v-if="gameOptions.solarPhaseOption" class="game-config generic" v-i18n>On</div>
              <div v-else class="game-config generic" v-i18n>Off</div>
            </li>
            <li v-if="gameOptions.requiresVenusTrackCompletion">Require terraforming Venus to end the game</li>
            <li v-if="gameOptions.requiresMoonTrackCompletion">Require terraforming The Moon to end the game</li>

            <li v-if="playerNumber > 1">
              <div class="setup-item" v-i18n>Milestones and Awards:</div>
              <div v-if="isRandomMANone()" class="game-config generic" v-i18n>Board-defined</div>
              <div v-if="isRandomMALimited()" class="game-config generic" v-i18n>Randomized with limited synergy</div>
              <div v-if="isRandomMAUnlimited()" class="game-config generic" v-i18n>Full randomized</div>
            </li>

            <li v-if="playerNumber > 1">
              <div class="setup-item" v-i18n>Draft:</div>
              <div v-if="gameOptions.initialDraftVariant" class="game-config generic" v-i18n>Initial</div>
              <div v-if="gameOptions.draftVariant" class="game-config generic" v-i18n>Research phase</div>
              <div v-if="!gameOptions.initialDraftVariant && !gameOptions.draftVariant" class="game-config generic" v-i18n>Off</div>
            </li>

            <li v-if="gameOptions.escapeVelocityMode">
              <div class="create-game-expansion-icon expansion-icon-escape-velocity"></div>
              <span>After {{gameOptions.escapeVelocityThreshold}} min, reduce {{gameOptions.escapeVelocityPenalty}} VP every {{gameOptions.escapeVelocityPeriod}} min.</span>
            </li>

            <li v-if="gameOptions.turmoilExtension && gameOptions.removeNegativeGlobalEvents">
              <div class="setup-item" v-i18n>Turmoil:</div>
              <div class="game-config generic" v-i18n>No negative Turmoil event</div>
            </li>

            <li v-if="playerNumber === 1">
              <div class="setup-item" v-i18n>Solo:</div>
              <div class="game-config generic" v-i18n>{{ this.lastSoloGeneration }} Gens</div>
              <div v-if="gameOptions.soloTR" class="game-config generic" v-i18n>63 TR</div>
              <div v-else class="game-config generic" v-i18n>TR all</div>
            </li>

            <li><div class="setup-item" v-i18n>Game configs:</div>
              <div v-if="gameOptions.fastModeOption" class="game-config fastmode" v-i18n>fast mode</div>
              <div v-if="gameOptions.showTimers" class="game-config timer" v-i18n>timer</div>
              <div v-if="gameOptions.showOtherPlayersVP" class="game-config realtime-vp" v-i18n>real-time vp</div>
              <div v-if="gameOptions.undoOption" class="game-config undo" v-i18n>undo</div>
            </li>

            <li v-if="gameOptions.cardsBlackList.length > 0"><div class="setup-item" v-i18n>Banned cards:</div>{{ gameOptions.cardsBlackList.join(', ') }}</li>
          </ul>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {BoardName} from '@/common/boards/BoardName';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {AgendaStyle} from '@/common/turmoil/Types';

export default Vue.extend({
  name: 'game-setup-detail',
  props: {
    playerNumber: {
      type: Number,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
    lastSoloGeneration: {
      type: Number,
    },
  },
  methods: {
    isPoliticalAgendasOn(): boolean {
      return (this.gameOptions.politicalAgendasExtension !== AgendaStyle.STANDARD);
    },
    getBoardColorClass(boardName: string): string {
      if (boardName === BoardName.ORIGINAL) {
        return 'game-config board-tharsis map';
      } else if (boardName === BoardName.HELLAS) {
        return 'game-config board-hellas map';
      } else if (boardName === BoardName.ELYSIUM) {
        return 'game-config board-elysium map';
      } else {
        return 'game-config board-other map';
      }
    },
    isRandomMANone(): boolean {
      return this.gameOptions.randomMA === RandomMAOptionType.NONE;
    },
    isRandomMALimited(): boolean {
      return this.gameOptions.randomMA === RandomMAOptionType.LIMITED;
    },
    isRandomMAUnlimited(): boolean {
      return this.gameOptions.randomMA === RandomMAOptionType.UNLIMITED;
    },
  },
});

</script>

