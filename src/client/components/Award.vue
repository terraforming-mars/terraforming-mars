<template>
  <div @click="toggleDescription" class="ma-block" title="press to show or hide the description">
    <div class="ma-player" v-if="award.player_name">
      <i :title="award.player_name" class="board-cube" :class="`board-cube--${award.player_color}`" />
    </div>

    <div class="ma-name ma-name--awards award-block" :class="maAwardClass" v-i18n>
      {{ award.award.name }}
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

    <div v-if="showDescription" class="ma-description" v-i18n>
      {{ award.award.description }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {FundedAwardModel, IAwardScore} from '@/models/FundedAwardModel';

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
  },
  data() {
    return {
      showDescription: false,
    };
  },
  methods: {
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },
  },
  computed: {
    maAwardClass(): string {
      return 'ma-name--' + this.award.award.name.replace(/ /g, '-').toLowerCase();
    },
    sortedScores(): IAwardScore[] {
      return [...this.award.scores].sort((s1, s2) => s2.playerScore - s1.playerScore);
    },
  },
});
</script>
