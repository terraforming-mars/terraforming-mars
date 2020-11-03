import Vue from "vue";
import { ClaimedMilestoneModel } from "../models/ClaimedMilestoneModel";

export const Milestone = Vue.component("milestone", {
    props: {
        milestones_list: {
            type: Array as () => Array<ClaimedMilestoneModel>
        }
    },
    data: function () {
        const showDescription: {[x: string]: boolean} = {};
        for (const milestone of this.milestones_list) {
            showDescription[milestone.milestone.name] = false;
        }
        return {
            showList: true,
            showDescription
        };
    },
    methods: {
        getNameCss: function (milestoneName: string): string {
            return (
                "ma-name ma-name--" + milestoneName.replace(/ /g, "-").toLowerCase()
            );
        },
        shouldShow: function (milestone: ClaimedMilestoneModel): boolean {
            return this.showDescription[milestone.milestone.name] === true;
        },
        shouldShowList: function (): boolean {
            return this.showList;
        },
        toggle: function (milestone: ClaimedMilestoneModel) {
            this.showDescription[milestone.milestone.name] = !this.showDescription[milestone.milestone.name];
        },
        toggleList: function () {
            this.showList = !this.showList;
        }
    },
    template: `
    <div class="milestones_cont" v-trim-whitespace>
        <div class="milestones">
            <div class="ma-title">
                <a class="ma-clickable" href="#" v-on:click.prevent="toggleList()" v-i18n>Milestones</a>
                <span v-for="milestone in milestones_list" v-if="milestone.player_name" class="claimed-milestone-inline" :title="milestone.player_name">
                    <span v-i18n>{{ milestone.milestone.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+milestone.player_color" /></span>
                </span>
            </div>
            <div v-show="shouldShowList()">
                <div title="press to show or hide the description" v-on:click.prevent="toggle(milestone)" v-for="milestone in milestones_list" :class="milestone.player_name ? 'ma-block pwned-item': 'ma-block'">
                    <div class="ma-player" v-if="milestone.player_name"><i :title="milestone.player_name" :class="'board-cube board-cube--'+milestone.player_color" /></div>
                    <div class="ma-name--milestones" :class="getNameCss(milestone.milestone.name)" v-i18n>
                        {{milestone.milestone.name}}
                        <div class="ma-scores player_home_block--milestones-and-awards-scores">
                            <p v-for="score in milestone.scores.sort(
                                (s1, s2) => s2.playerScore - s1.playerScore
                            )" :class="'ma-score player_bg_color_'+score.playerColor">{{ score.playerScore }}</p>
                        </div>
                    </div>
                    <div v-show="shouldShow(milestone)" class="ma-description" v-i18n>{{milestone.milestone.description}}</div>
                </div>
            </div>
        </div>
    </div>
    `,
});
