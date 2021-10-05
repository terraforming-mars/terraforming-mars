<template>
    <div class="milestones_cont" v-trim-whitespace>
        <div class="milestones">
            <div class="ma-title">
                <a class="ma-clickable" href="#" v-on:click.prevent="toggleList()" v-i18n>Milestones</a>
                <span v-for="milestone in milestones_list.filter((m) => m.player_name)" :key="milestone.milestone.name" class="milestone-award-inline paid" :title="milestone.player_name">
                    <span v-i18n>{{ milestone.milestone.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+milestone.player_color" /></span>
                </span>
                <span v-if="isLearnerModeOn()">
                    <span v-for="(spotPrice, index) in getAvailableMilestoneSpots()" :key="index" class="milestone-award-inline unpaid">
                        <div class="milestone-award-price">{{spotPrice}}</div>
                    </span>
                </span>
            </div>
            <div v-show="shouldShowList()">
                <div title="press to show or hide the description" v-on:click.prevent="toggle(milestone)" v-for="milestone in milestones_list" :key="milestone.milestone.name" :class="milestone.player_name ? 'ma-block pwned-item': 'ma-block'">
                    <div class="ma-player" v-if="milestone.player_name"><i :title="milestone.player_name" :class="'board-cube board-cube--'+milestone.player_color" /></div>
                    <div class="ma-name--milestones" :class="getNameCss(milestone.milestone.name)" v-i18n>
                        {{milestone.milestone.name}}
                        <div v-if="show_scores" class="ma-scores player_home_block--milestones-and-awards-scores">
                            <p v-for="score in [...milestone.scores].sort(
                                (s1, s2) => s2.playerScore - s1.playerScore
                            )" :key="score.playerColor" :class="'ma-score player_bg_color_'+score.playerColor">{{ score.playerScore }}</p>
                        </div>
                    </div>
                    <div v-show="shouldShow(milestone)" class="ma-description" v-i18n>{{milestone.milestone.description}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {MILESTONE_COST, MAX_MILESTONES} from '@/constants';
import {ClaimedMilestoneModel} from '@/models/ClaimedMilestoneModel';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

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
    const showDescription: {[x: string]: boolean} = {};
    for (const milestone of this.milestones_list) {
      showDescription[milestone.milestone.name] = false;
    }
    return {
      showList: this.milestones_list.filter((milestone) => milestone.player_name).length === MAX_MILESTONES ? false : true,
      showDescription,
    };
  },
  methods: {
    getNameCss(milestoneName: string): string {
      return (
        'ma-name ma-name--' + milestoneName.replace(/ /g, '-').toLowerCase()
      );
    },
    shouldShow(milestone: ClaimedMilestoneModel): boolean {
      return this.showDescription[milestone.milestone.name] === true;
    },
    shouldShowList(): boolean {
      return this.showList;
    },
    toggle(milestone: ClaimedMilestoneModel) {
      this.showDescription[milestone.milestone.name] = !this.showDescription[milestone.milestone.name];
    },
    toggleList() {
      this.showList = !this.showList;
    },
    getAvailableMilestoneSpots(): Array<number> {
      const count = this.milestones_list.filter((milestone) => milestone.player_name).length;
      return Array(MAX_MILESTONES - count).fill(MILESTONE_COST);
    },
    isLearnerModeOn(): boolean {
      return PreferencesManager.load('learner_mode') === '1';
    },
  },
});
</script>
