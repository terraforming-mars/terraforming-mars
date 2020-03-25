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
        }
    },
    template: `
    <div class="milestones_cont">
        <div class="milestones">
            <a href="#" v-on:click.prevent="toggleMe()" v-i18n>Milestones List</a>
            <ul v-show="isVisible()">
                <li v-for="milestone in milestones_list">
                    <strong v-i18n>{{milestone.name}}</strong> — <span v-i18n>{{milestone.description}}</span>
                </li>
            </ul>
        </div>
    </div>
    `
});

