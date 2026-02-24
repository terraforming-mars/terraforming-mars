<template>
  <div class="ma-block">
    <div class="ma-player" v-if="milestone.playerName">
      <i :title="milestone.playerName" class="board-cube" :class="`board-cube--${milestone.color}`" />
    </div>
    <div class="ma-name--milestones" :class="nameCss">
      <span v-i18n>{{name}}</span>
      <div v-if="showScores" class="ma-scores player_home_block--milestones-and-awards-scores">
        <template v-for="score in sortedScores" :key="score.color">
          <p
            v-if="playerSymbol(score.color).length > 0"
            class="ma-score"
            :class="`player_bg_color_${score.color}`"
            v-text="playerSymbol(score.color)"
            data-test="player-score"
          />
          <p
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

<script setup lang="ts">

import {computed} from 'vue';
import {ClaimedMilestoneModel, MilestoneScore} from '@/common/models/ClaimedMilestoneModel';
import {getMilestone} from '@/client/MilestoneAwardManifest';
import {playerSymbol} from '@/client/utils/playerSymbol';
import {Color} from '@/common/Color';

const props = withDefaults(defineProps<{
  milestone: ClaimedMilestoneModel;
  showScores?: boolean;
  showDescription?: boolean;
}>(), {
  showScores: true,
});

function getClass(score: MilestoneScore): string {
  let classes = 'ma-score';
  classes += ` player_bg_color_${score.color}`;
  if (score.claimable) {
    classes += ' claimable';
  } else {
    classes += ' not-claimable';
  }
  return classes;
}

const name = computed((): string => {
  return props.milestone.name.replace(/[0-9]+$/, '');
});

const nameCss = computed((): string => {
  return 'ma-name ma-name--' + props.milestone.name.replace(/ /g, '-').replace(/\./g, '').toLowerCase();
});

const sortedScores = computed((): Array<MilestoneScore> => {
  return [...props.milestone.scores].sort((s1, s2) => s2.score - s1.score);
});

const description = computed((): string => {
  return getMilestone(props.milestone.name).description;
});
</script>
