<template>
  <div class="ma-block">
    <div class="ma-player" v-if="award.playerName">
      <i :title="award.playerName" class="board-cube" :class="`board-cube--${award.playerColor}`" />
    </div>

    <div class="ma-name ma-name--awards award-block" :class="maAwardClass">
      <span v-i18n>{{ award.name }}</span>
      <div class="ma-scores player_home_block--milestones-and-awards-scores" v-if="showScores">
        <p
          v-for="score in sortedScores"
          :key="score.playerColor"
          class="ma-score"
          :class="`player_bg_color_${score.playerColor}`"
          v-text="score.playerScore"
          data-test="player-score"
        />
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
import {getMilestoneAwardDescription} from '@/client/MilestoneAwardManifest';

export default Vue.extend({
  name: 'Award',
  props: {
    award: {
      type: Object as () => FundedAwardModel,
      required: true,
    },
    showScores: {
      type: Boolean,
      default: false,
    },
    showDescription: {
      type: Boolean,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    maAwardClass(): string {
      return 'ma-name--' + this.award.name.replace(/ /g, '-').replace(/\./g, '').toLowerCase();
    },
    sortedScores(): AwardScore[] {
      return [...this.award.scores].sort((s1, s2) => s2.playerScore - s1.playerScore);
    },
    description(): string {
      return getMilestoneAwardDescription(this.award.name);
    },
  },
});
</script>
