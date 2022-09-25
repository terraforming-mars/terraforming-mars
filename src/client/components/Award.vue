<template>
  <div class="ma-block">
    <div class="ma-player" v-if="award.player_name">
      <i :title="award.player_name" class="board-cube" :class="`board-cube--${award.player_color}`" />
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
      <span v-i18n>{{ award.description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {FundedAwardModel, AwardScore} from '@/common/models/FundedAwardModel';

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
  },
});
</script>
