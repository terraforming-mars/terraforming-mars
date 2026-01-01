<template>
  <div class="ma-block">
    <div class="ma-player" v-if="milestone.playerName">
      <i :title="milestone.playerName" class="board-cube" :class="`board-cube--${milestone.color}`" />
    </div>
    <div class="ma-name--milestones" :class="nameCss">
      <span v-i18n>{{name}}</span>
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
            :class="getClass(score)"
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
import {ClaimedMilestoneModel, MilestoneScore} from '@/common/models/ClaimedMilestoneModel';
import {getMilestone} from '@/client/MilestoneAwardManifest';
import {playerSymbol} from '@/client/utils/playerSymbol';
import {Color} from '@/common/Color';

export default Vue.extend({
  name: 'Milestone',
  props: {
    milestone: {
      type: Object as () => ClaimedMilestoneModel,
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
    playerSymbol(color: Color): string {
      return playerSymbol(color);
    },
    getClass(score: MilestoneScore): string {
      let classes = 'ma-score';
      classes += ` player_bg_color_${score.color}`;
      if (score.claimable) {
        classes += ' claimable';
      } else {
        classes += ' not-claimable';
      }
      return classes;
    },
  },
  computed: {
    name(): string {
      return this.milestone.name.replace(/[0-9]+$/, '');
    },
    nameCss(): string {
      return 'ma-name ma-name--' + this.milestone.name.replace(/ /g, '-').replace(/\./g, '').toLowerCase();
    },
    sortedScores(): Array<MilestoneScore> {
      return [...this.milestone.scores].sort((s1, s2) => s2.score - s1.score);
    },
    description(): string {
      return getMilestone(this.milestone.name).description;
    },
  },
});
</script>
