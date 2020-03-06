 /**
  * This component show the milestone list
  */

import Vue from "vue";

export const Milestone = Vue.component("milestone", {
    props: ["milestones_list", "expanded"],
    template: `
    <div class="milestones_cont">
        <div class="milestones">
            <span v-on:click="expanded=!expanded">Milestones List</span>
            <ul v-show="expanded === true">
                <li v-for="milestone in milestones_list">
                    <strong>{{milestone.name}}</strong> — {{milestone.description}}
                </li>
            </ul>
        </div>
    </div>
    `
});

