 /**
  * This component show the milestone list
  */

import Vue from "vue";
import { ORIGINAL_MILESTONES } from "../milestones/Milestones";

export const Milestone = Vue.component("milestone", {
    data: function () {
        return {
            "milestones_list": ORIGINAL_MILESTONES
        };
    },
    template: `
    <div class="milestones_cont">
        <div class="milestones">
            <span>Milestones:</span>
            <ul>
                <li v-for="milestone in milestones_list">
                    {{milestone.name}} : {{milestone.description}}
                </li>
            </ul>
        </div>
    </div>
    `
});

