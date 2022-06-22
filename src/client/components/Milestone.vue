<template>
    <div class="milestones_cont" v-trim-whitespace>
        <div class="milestones">
            <div class="ma-title">
                <a class="ma-clickable" href="#" v-on:click.prevent="toggleList()" v-i18n>Milestones</a>
                <span v-for="milestone in milestones_list.filter((m) => m.player_name)" :key="milestone.name" class="milestone-award-inline paid" :title="milestone.player_name">
                    <span v-i18n>{{ milestone.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+milestone.player_color" /></span>
                </span>
                <span v-if="isLearnerModeOn()">
                    <span v-for="(spotPrice, index) in getAvailableMilestoneSpots()" :key="index" class="milestone-award-inline unpaid">
                        <div class="milestone-award-price">{{spotPrice}}</div>
                    </span>
                </span>
            </div>
            <div v-show="shouldShowList()">
                <div title="press to show or hide the description" v-on:click.prevent="toggleDescription()" v-for="milestone in milestones_list" :key="milestone.name" :class="milestone.player_name ? 'ma-block pwned-item': 'ma-block'">
                    <div class="ma-player" v-if="milestone.player_name"><i :title="milestone.player_name" :class="'board-cube board-cube--'+milestone.player_color" /></div>
                    <div class="ma-name--milestones" :class="getNameCss(milestone.name)" v-i18n>
                        {{milestone.name}}
                        <div v-if="show_scores" class="ma-scores player_home_block--milestones-and-awards-scores">
                            <p v-for="score in [...milestone.scores].sort(
                                (s1, s2) => s2.playerScore - s1.playerScore
                            )" :key="score.playerColor" :class="'ma-score player_bg_color_'+score.playerColor">{{ score.playerScore }}</p>
                        </div>
                    </div>
                    <div v-show="showDescription" class="ma-description" v-i18n>{{milestone.description}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {MILESTONE_COST, MAX_MILESTONES} from '@/common/constants';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';
import {getPreferences} from '@/client/utils/PreferencesManager';


export default Vue.extend({
  name: 'Milestone',
  props: {
    milestones_list: {
      type: Array as () => Array<ClaimedMilestoneModel>,
    },
    show_scores: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showList: this.milestones_list.filter((milestone) => milestone.player_name).length === MAX_MILESTONES ? false : true,
      showDescription: false,
    };
  },
  methods: {
    getNameCss(milestoneName: string): string {
      return (
        'ma-name ma-name--' + milestoneName.replace(/ /g, '-').toLowerCase()
      );
    },
    shouldShowList(): boolean {
      return this.showList;
    },
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },
    toggleList() {
      this.showList = !this.showList;
    },
    getAvailableMilestoneSpots(): Array<number> {
      const count = this.milestones_list.filter((milestone) => milestone.player_name).length;
      return Array(MAX_MILESTONES - count).fill(MILESTONE_COST);
    },
    isLearnerModeOn(): boolean {
      return getPreferences().learner_mode;
    },
  },
});
</script>
