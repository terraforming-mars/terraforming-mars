 /**
  * This component show the milestone list
  */

import Vue from "vue";

export const Milestone = Vue.component("milestone", {
    props: ["milestones_list"],
    data: function () {
        return {
            displayed: false
        };
    },
    methods: {
        toggleDisplayed: function () {
            this.displayed = !this.displayed;
        }
    },
    template: `
    <div class="milestones_cont">
        <div class="milestones">
            <span v-on:click="toggleDisplayed()">Milestones List</span>
            <ul v-if="displayed === true">
                <li v-for="milestone in milestones_list">
                    {{milestone.name}}: {{milestone.description}}
                </li>
            </ul>
        </div>
    </div>
    `
});

