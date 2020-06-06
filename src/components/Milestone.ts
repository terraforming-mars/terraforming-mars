 /**
  * This component show the milestone list
  */

import Vue from "vue";

export const Milestone = Vue.component("milestone", {
    props: ["milestones_list"],
    methods: {
        toggleMe: function () {
            let currentState: boolean = this.isVisible();
            (this.$root as any).setVisibilityState("millestones_list", ! currentState);
        },
        isVisible: function () {
            return (this.$root as any).getVisibilityState("millestones_list");
        },
        getNameCss: function(milestoneName: string): string {
            return "ma-name ma-name--" +  milestoneName.replace(/ /g, "-").toLowerCase();
        }
    },
    template: `
    <div class="milestones_cont" v-trim-whitespace>
        <div class="milestones">
            <div class="ma-title">
                <a class="ma-clickable" href="#" v-on:click.prevent="toggleMe()" v-i18n>Milestones</a>
                <span v-for="milestone in milestones_list" v-if="milestone.player_name" class="claimed-milestone-inline" :title="milestone.player_name">
                    <span v-i18n>{{ milestone.milestone.name }}</span>: <span>{{ milestone.player_name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+milestone.player_color" /></span>
                </span>
            </div>
            <div v-show="isVisible()">
                <div v-for="milestone in milestones_list" :class="milestone.player_name ? 'ma-block pwned-item': 'ma-block'">
                    <div class="ma-player" v-if="milestone.player_name"><i :title="milestone.player_name" :class="'board-cube board-cube--'+milestone.player_color" /></div>
                    <div class="ma-name--milestones" :class="getNameCss(milestone.milestone.name)" v-i18n>{{milestone.milestone.name}}</div>
                    <div class="ma-description" v-i18n>{{milestone.milestone.description}}</div>
                </div>
            </div>
        </div>
    </div>
    `
});

