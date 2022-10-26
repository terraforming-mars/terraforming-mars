<template>
  <div :title="$t('press to show or hide the description')" v-on:click.prevent="toggleDescription()" :class="milestone.player_name ? 'ma-block pwned-item': 'ma-block'">
      <div class="ma-player" v-if="milestone.player_name"><i :title="milestone.player_name" :class="'board-cube board-cube--'+milestone.player_color" /></div>
      <div class="ma-name--milestones" :class="getNameCss(milestone.name)">
          <span v-i18n>{{milestone.name}}</span>
          <div v-if="show_scores" class="ma-scores player_home_block--milestones-and-awards-scores">
              <p v-for="score in [...milestone.scores].sort(
                  (s1, s2) => s2.playerScore - s1.playerScore
              )" :key="score.playerColor" :class="'ma-score player_bg_color_'+score.playerColor">{{ score.playerScore }}</p>
          </div>
      </div>
      <div v-show="showDescription" class="ma-description" v-i18n>{{milestone.description}}</div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';

export default Vue.extend({
  name: 'Milestone',
  props: {
    milestone: {
      type: Object as () => ClaimedMilestoneModel,
    },
    show_scores: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showDescription: false,
    };
  },
  methods: {
    getNameCss(milestoneName: string): string {
      return (
        'ma-name ma-name--' + milestoneName.replace(/ /g, '-').toLowerCase()
      );
    },
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },
  },
});
</script>
