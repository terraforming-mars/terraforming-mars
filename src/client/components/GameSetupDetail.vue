<template>
        <div id="game-setup-detail" class="game-setup-detail-container">
          <ul>
            <li><div class="setup-item" v-i18n>Expansion:</div>
              <a v-if="gameOptions.expansions.venus" :href="rulebookUrls.venus" class="tooltip" data-tooltip="Venus Next rulebook" target="_blank"><div class="create-game-expansion-icon expansion-icon-venus"></div></a>
              <a v-if="gameOptions.expansions.prelude" :href="rulebookUrls.prelude" class="tooltip" data-tooltip="Prelude rulebook" target="_blank"><div class="create-game-expansion-icon expansion-icon-prelude"></div></a>
              <a v-if="gameOptions.expansions.prelude2" :href="rulebookUrls.prelude2" class="tooltip" data-tooltip="Prelude 2 rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-prelude2"></div></a>
              <a v-if="gameOptions.expansions.colonies" :href="rulebookUrls.colonies" class="tooltip" data-tooltip="Colonies rulebook" target="_blank"><div class="create-game-expansion-icon expansion-icon-colony"></div></a>
              <a v-if="gameOptions.expansions.turmoil" :href="rulebookUrls.turmoil" class="tooltip" data-tooltip="Turmoil rulebook" target="_blank"><div class="create-game-expansion-icon expansion-icon-turmoil"></div></a>
              <a v-if="gameOptions.expansions.promo" :href="rulebookUrls.promo" class="tooltip" data-tooltip="Promo cards rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-promo"></div></a>
              <a v-if="gameOptions.expansions.ares" :href="rulebookUrls.ares" class="tooltip" data-tooltip="Ares rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-ares"></div></a>
              <a v-if="gameOptions.expansions.moon" :href="rulebookUrls.moon" class="tooltip" data-tooltip="The Moon rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-themoon"></div></a>
              <a v-if="gameOptions.expansions.pathfinders" :href="rulebookUrls.pathfinders" class="tooltip" data-tooltip="Pathfinders rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-pathfinders"></div></a>
              <a v-if="gameOptions.expansions.community" :href="rulebookUrls.community" class="tooltip" data-tooltip="Community rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-community"></div></a>
              <div v-if="isPoliticalAgendasOn" class="create-game-expansion-icon expansion-icon-agendas"></div>
              <a v-if="gameOptions.expansions.ceo" :href="rulebookUrls.ceo" class="tooltip" data-tooltip="CEOs rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-ceo"></div></a>
              <a v-if="gameOptions.expansions.underworld" :href="rulebookUrls.underworld" class="tooltip" data-tooltip="Underworld rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-underworld"></div></a>
              <a v-if="gameOptions.expansions.starwars" :href="rulebookUrls.starwars" class="tooltip" data-tooltip="Star Wars rules" target="_blank"><div class="create-game-expansion-icon expansion-icon-starwars"></div></a>
            </li>

            <li><div class="setup-item" v-i18n>Board:</div>
              <span :class="boardColorClass" v-i18n>{{ gameOptions.boardName }}</span>
              &nbsp;
              <span v-if="gameOptions.shuffleMapOption" class="game-config generic" v-i18n>(randomized tiles)</span>
            </li>

            <li><div class="setup-item" v-i18n>WGT:</div>
              <div v-if="gameOptions.solarPhaseOption" class="game-config generic" v-i18n>On</div>
              <div v-else class="game-config generic" v-i18n>Off</div>
            </li>
            <li v-if="gameOptions.requiresVenusTrackCompletion" v-i18n>Require terraforming Venus to end the game</li>
            <li v-if="gameOptions.requiresMoonTrackCompletion" v-i18n>Require terraforming The Moon to end the game</li>

            <li v-if="playerNumber > 1">
              <div class="setup-item" v-i18n>Milestones and Awards:</div>

              <div v-if="gameOptions.randomMA === RandomMAOptionType.NONE" class="game-config generic" v-i18n>Board-defined</div>
              <div v-if="gameOptions.randomMA === RandomMAOptionType.LIMITED" class="game-config generic" v-i18n>Randomized with limited synergy</div>
              <div v-if="gameOptions.randomMA === RandomMAOptionType.UNLIMITED" class="game-config generic" v-i18n>Full randomized</div>
              <div v-if="gameOptions.randomMA !== RandomMAOptionType.NONE && gameOptions.includeFanMA" class="game-config generic" v-i18n>Include fan Milestones/Awards</div>
            </li>

            <li v-if="playerNumber > 1">
              <div class="setup-item" v-i18n>Draft:</div>
              <div v-if="gameOptions.initialDraftVariant" class="game-config generic" v-i18n>Initial</div>
              <div v-if="gameOptions.draftVariant" class="game-config generic" v-i18n>Research phase</div>
              <div v-if="!gameOptions.initialDraftVariant && !gameOptions.draftVariant" class="game-config generic" v-i18n>Off</div>
              <div v-if="gameOptions.preludeDraftVariant">Prelude</div>
            </li>

            <li v-if="gameOptions.escapeVelocity !== undefined">
              <div class="create-game-expansion-icon expansion-icon-escape-velocity"></div>
              <span>{{escapeVelocityDescription}}</span>
            </li>

            <li v-if="gameOptions.expansions.venus && gameOptions.removeNegativeGlobalEvents">
              <div class="setup-item" v-i18n>Turmoil:</div>
              <div class="game-config generic" v-i18n>No negative Turmoil event</div>
            </li>

            <li v-if="playerNumber === 1">
              <div class="setup-item" v-i18n>Solo:</div>
              <div class="game-config generic" v-i18n>{{ lastSoloGeneration }} Gens</div>
              <div v-if="gameOptions.soloTR" class="game-config generic" v-i18n>63 TR</div>
              <div v-else class="game-config generic" v-i18n>TR all</div>
            </li>

            <li><div class="setup-item" v-i18n>Game configs:</div>
              <div v-if="gameOptions.fastModeOption" class="game-config fastmode" v-i18n>fast mode</div>
              <div v-if="gameOptions.showTimers" class="game-config timer" v-i18n>timer</div>
              <div v-if="gameOptions.showOtherPlayersVP" class="game-config realtime-vp" v-i18n>real-time vp</div>
              <div v-if="gameOptions.undoOption" class="game-config undo" v-i18n>undo</div>
            </li>
            <li v-if="gameOptions.twoCorpsVariant"><div class="setup-item" v-i18n>Merger</div></li>
            <li v-if="gameOptions.bannedCards.length > 0"><div class="setup-item" v-i18n>Banned cards:</div>{{ gameOptions.bannedCards.join(', ') }}</li>
          </ul>
        </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {BoardName} from '@/common/boards/BoardName';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {translateTextWithParams} from '@/client/directives/i18n';
import {RULEBOOK_URLS} from '@/client/utils/WikiLinks';

const boardColorClass: Record<BoardName, string> = {
  [BoardName.THARSIS]: 'game-config board-tharsis map',
  [BoardName.HELLAS]: 'game-config board-hellas map',
  [BoardName.ELYSIUM]: 'game-config board-elysium map',
  [BoardName.UTOPIA_PLANITIA]: 'game-config board-utopia-planitia map',
  [BoardName.VASTITAS_BOREALIS_NOVA]: 'game-config board-vastitas_borealis_nova map',
  [BoardName.TERRA_CIMMERIA_NOVA]: 'game-config board-terra_cimmeria_nova map',
  [BoardName.AMAZONIS]: 'game-config board-amazonis map',
  [BoardName.ARABIA_TERRA]: 'game-config board-arabia_terra map',
  [BoardName.VASTITAS_BOREALIS]: 'game-config board-vastitas_borealis map',
  [BoardName.TERRA_CIMMERIA]: 'game-config board-terra_cimmeria map',
  [BoardName.HOLLANDIA]: 'game-config board-hollandia map',
};

export default defineComponent({
  name: 'game-setup-detail',
  props: {
    playerNumber: {
      type: Number,
      required: true,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
      required: true,
    },
    lastSoloGeneration: {
      type: Number,
      required: true,
    },
  },
  computed: {
    rulebookUrls(): typeof RULEBOOK_URLS {
      return RULEBOOK_URLS;
    },
    isPoliticalAgendasOn(): boolean {
      return (this.gameOptions.politicalAgendasExtension !== 'Standard');
    },
    boardColorClass(): string {
      return boardColorClass[this.gameOptions.boardName];
    },
    escapeVelocityDescription(): string {
      if (this.gameOptions.escapeVelocity === undefined) {
        return '';
      }
      const ev = this.gameOptions.escapeVelocity;
      return translateTextWithParams(
        'After ${0} min, reduce ${1} VP every ${2} min. (${3} bonus sec. per action.)',
        [
          ev.thresholdMinutes.toString(),
          ev.penaltyVPPerPeriod.toString(),
          ev.penaltyPeriodMinutes.toString(),
          ev.bonusSectionsPerAction.toString(),
        ]);
    },
    RandomMAOptionType(): typeof RandomMAOptionType {
      return RandomMAOptionType;
    },
  },
});

</script>
