<template>
  <div class="ma-block">
    <div class="ma-player" v-if="award.playerName">
      <i :title="award.playerName" class="board-cube" :class="`board-cube--${award.playerColor}`" />
    </div>

    <div class="ma-name ma-name--awards award-block" :class="nameCss">
      <span v-i18n>{{ award.name }}</span>
      <div v-if="showScores" class="ma-scores player_home_block--milestones-and-awards-scores">
        <template v-for="score in sortedScores">
          <p
            v-if="playerSymbol(score.playerColor).length > 0"
            :key="score.playerColor"
            class="ma-score"
            :class="`player_bg_color_${score.playerColor}`"
            v-text="playerSymbol(score.playerColor)"
            data-test="player-score"
          />
          <p
            :key="score.playerColor"
            class="ma-score"
            :class="`player_bg_color_${score.playerColor}`"
            v-text="score.playerScore"
            data-test="player-score"
          />
      </template>
      </div>
    </div>

    <div v-if="showDescription" class="ma-description">
      <span v-i18n>{{ description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {FundedAwardModel, AwardScore} from '@/common/models/FundedAwardModel';
import {getAward} from '@/client/MilestoneAwardManifest';
import {playerSymbol} from '@/client/utils/playerSymbol';
import {Color} from '@/common/Color';

export default Vue.extend({
  name: 'Award',
  props: {
    award: {
      type: Object as () => FundedAwardModel,
      required: true,
    },
    showScores: {
      type: Boolean,
      default: true,
    },
    showDescription: {
      type: Boolean,
    },
  },
  methods: {
    playerSymbol(color: Color) {
      return playerSymbol(color);
    },
  },
  computed: {
    nameCss(): string {
      return 'ma-name--' + this.award.name.replace(/ /g, '-').replace(/\./g, '').toLowerCase();
    },
    sortedScores(): Array<AwardScore> {
      return [...this.award.scores].sort((s1, s2) => s2.playerScore - s1.playerScore);
    },
    description(): string {
      return getAward(this.award.name).description;
    },
  },
});
</script>
