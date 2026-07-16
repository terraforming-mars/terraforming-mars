<template>
  <div class="ma-block">
    <div class="ma-player" v-if="award.playerName">
      <i :title="award.playerName" class="board-cube" :class="`board-cube--${award.color}`" />
    </div>

    <div class="ma-name ma-name--awards award-block" :class="nameCss">
      <span v-i18n>{{ award.name }}</span>
      <div v-if="showScores" class="ma-scores player_home_block--milestones-and-awards-scores">
        <template v-for="score in sortedScores">
          <p
            v-if="playerSymbol(score.color).length > 0"
            :key="score.color + '-symbol'"
            class="ma-score"
            :class="`player_bg_color_${score.color}`"
            v-text="playerSymbol(score.color)"
            data-test="player-score"
          />
          <p
            :key="score.color"
            class="ma-score"
            :class="`player_bg_color_${score.color}`"
            v-text="score.score"
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
      return [...this.award.scores].sort((s1, s2) => s2.score - s1.score);
    },
    description(): string {
      return getAward(this.award.name).description;
    },
  },
});
</script>
