 /**
  * This component show the award list
  */

import Vue from "vue";

export const Award = Vue.component("award", {
    props: ["awards_list"],
    methods: {
        toggleMe: function () {
            let currentState: boolean = this.isVisible();
            (this.$root as any).setVisibilityState("awards_list", ! currentState);
        },
        isVisible: function () {
            return (this.$root as any).getVisibilityState("awards_list");
        },
        getNameCss: function(awardName: string): string {
            return "ma-name ma-name--" +  awardName.replace(/ /g, "-").toLowerCase();
        },
        getNameId: function(awardName: string): string {
            return awardName.replace(/ /g, "");
        },
        toggleMADescription: function(awardName: string) {
            //TODO - rework this with v-show?
            document.querySelector(`#${awardName} > .ma-description`)?.classList.toggle("ma-description-hidden");
        }
    },
    template: `
    <div class="awards_cont" v-trim-whitespace>
        <div class="awards">
            <div class="ma-title">
                <a  class="ma-clickable awards-padding" href="#" v-on:click.prevent="toggleMe()" v-i18n>Awards</a>
                <span v-for="award in awards_list" v-if="award.player_name" class="funded-award-inline" :title="award.player_name">
                    <span v-i18n>{{ award.award.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+award.player_color" /></span>
                </span>
            </div>
            
            <div v-show="isVisible()">
                <div :id="getNameId(award.award.name)" title="press to show or hide the description" v-on:click.prevent="toggleMADescription(getNameId(award.award.name))" v-for="award in awards_list" class="ma-block">
                    <div class="ma-player" v-if="award.player_name"><i :title="award.player_name" :class="'board-cube board-cube--'+award.player_color" /></div>
                    <div class="ma-name--awards" :class="getNameCss(award.award.name)" v-i18n>
                        {{award.award.name}}
                        <div class="ma-scores player_home_block--milestones-and-awards-scores">
                            <p v-for="score in award.scores.sort(
                                (s1, s2) => s2.playerScore - s1.playerScore
                            )" :class="'ma-score player_bg_color_'+score.playerColor">{{ score.playerScore }}</p>
                        </div>
                    </div>
                    <div class="ma-description ma-description-hidden" v-i18n>{{award.award.description}}</div>
                </div>
            </div>
        </div>
    </div>
    `
});

