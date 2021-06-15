<template>
    <div class="awards_cont" v-trim-whitespace>
        <div class="awards">
            <div class="ma-title">
                <a class="ma-clickable awards-padding" href="#" v-on:click.prevent="toggleList()" v-i18n>Awards</a>
                <span v-for="award in awards_list.filter((a) => a.player_name)" :key="award.award.name" class="milestone-award-inline paid" :title="award.player_name">
                    <span v-i18n>{{ award.award.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+award.player_color" /></span>
                </span>
                <span v-if="isLearnerModeOn()">
                  <span v-for="spotPrice in getAvailableAwardSpots()" :key="spotPrice" class="milestone-award-inline unpaid">
                    <div class="milestone-award-price">{{spotPrice}}</div>
                  </span>
                </span>
            </div>

            <div v-show="shouldShowList()">
                <div title="press to show or hide the description" v-on:click.prevent="toggle(award)" v-for="award in awards_list" :key="award.award.name" class="ma-block">
                    <div class="ma-player" v-if="award.player_name"><i :title="award.player_name" :class="'board-cube board-cube--'+award.player_color" /></div>
                    <div class="ma-name--awards award-block" :class="getNameCss(award.award.name)" v-i18n>
                        {{award.award.name}}
                        <div v-if="show_scores" class="ma-scores player_home_block--milestones-and-awards-scores">
                            <p v-for="score in award.scores.sort(
                                (s1, s2) => s2.playerScore - s1.playerScore
                            )" :key="score.playerColor" :class="'ma-score player_bg_color_'+score.playerColor">{{ score.playerScore }}</p>
                        </div>
                    </div>
                    <div v-show="shouldShow(award)" class="ma-description" v-i18n>{{award.award.description}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {AWARD_COSTS} from '../constants';
import {FundedAwardModel} from '../models/FundedAwardModel';
import {PreferencesManager} from './PreferencesManager';

export default Vue.extend({
  name: 'Award',
  props: {
    awards_list: {
      type: Array as () => Array<FundedAwardModel>,
    },
    show_scores: {
      type: Boolean,
      default: true,
    },
  },
  data: function() {
    const showDescription: {[x: string]: boolean} = {};
    for (const award of this.awards_list) {
      showDescription[award.award.name] = false;
    }
    return {
      showDescription,
      showList: true,
    };
  },
  methods: {
    getNameCss: function(awardName: string): string {
      return (
        'ma-name ma-name--' + awardName.replace(/ /g, '-').toLowerCase()
      );
    },
    shouldShow: function(award: FundedAwardModel): boolean {
      return this.showDescription[award.award.name] === true;
    },
    shouldShowList: function(): boolean {
      return this.showList;
    },
    toggle: function(award: FundedAwardModel) {
      this.showDescription[award.award.name] = !this.showDescription[award.award.name];
    },
    toggleList: function() {
      this.showList = !this.showList;
    },
    getAvailableAwardSpots: function(): Array<number> {
      let numFundedAwards = 0;
      this.awards_list.forEach((award)=>{
        if (award.player_name) {
          numFundedAwards++;
        }
      });
      return AWARD_COSTS.slice(numFundedAwards);
    },
    isLearnerModeOn: function(): boolean {
      return PreferencesManager.loadBoolean('learner_mode');
    },
  },
});
</script>
