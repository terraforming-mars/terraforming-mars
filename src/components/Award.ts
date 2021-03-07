import Vue from 'vue';
import {AWARD_COSTS} from '../constants';
import {FundedAwardModel} from '../models/FundedAwardModel';
import {PreferencesManager} from './PreferencesManager';

export const Award = Vue.component('award', {
  props: {
    awards_list: {
      type: Array as () => Array<FundedAwardModel>,
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
      return PreferencesManager.loadValue('learner_mode') === '1';
    },
  },
  template: `
    <div class="awards_cont" v-trim-whitespace>
        <div class="awards">
            <div class="ma-title">
                <a class="ma-clickable awards-padding" href="#" v-on:click.prevent="toggleList()" v-i18n>Awards</a>
                <span v-for="award in awards_list" v-if="award.player_name" class="milestone-award-inline paid" :title="award.player_name">
                    <span v-i18n>{{ award.award.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+award.player_color" /></span>
                </span>
                <span v-for="spotPrice in getAvailableAwardSpots()" class="milestone-award-inline unpaid" v-if="isLearnerModeOn()">
                  <div class="milestone-award-price">{{spotPrice}}</div>
                </span>
            </div>

            <div v-show="shouldShowList()">
                <div title="press to show or hide the description" v-on:click.prevent="toggle(award)" v-for="award in awards_list" class="ma-block">
                    <div class="ma-player" v-if="award.player_name"><i :title="award.player_name" :class="'board-cube board-cube--'+award.player_color" /></div>
                    <div class="ma-name--awards award-block" :class="getNameCss(award.award.name)" v-i18n>
                        {{award.award.name}}
                        <div class="ma-scores player_home_block--milestones-and-awards-scores">
                            <p v-for="score in award.scores.sort(
                                (s1, s2) => s2.playerScore - s1.playerScore
                            )" :class="'ma-score player_bg_color_'+score.playerColor">{{ score.playerScore }}</p>
                        </div>
                    </div>
                    <div v-show="shouldShow(award)" class="ma-description" v-i18n>{{award.award.description}}</div>
                </div>
            </div>
        </div>
    </div>
    `,
});
