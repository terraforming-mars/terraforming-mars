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
                <div v-for="award in awards_list" :class="award.player_name ? 'ma-block pwned-item': 'ma-block'">
                    <div class="ma-player" v-if="award.player_name"><i :title="award.player_name" :class="'board-cube board-cube--'+award.player_color" /></div>
                    <div class="ma-name--awards" :class="getNameCss(award.award.name)" v-i18n>{{award.award.name}}</div>
                    <div class="ma-description" v-i18n>{{award.award.description}}</div>
                </div>
            </div>
        </div>
    </div>
    `
});

