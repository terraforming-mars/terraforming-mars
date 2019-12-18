 /**
  * This component show the award list
  */

import Vue from "vue";
import { ORIGINAL_AWARDS } from "../awards/Awards";

export const Award = Vue.component("award", {
    data: function () {
        return {
            displayed: false,
            "awards_list": ORIGINAL_AWARDS
        };
    },
    methods: {
        toggleDisplayed: function () {
            this.displayed = !this.displayed;
        }
    },
    template: `
    <div class="awards_cont">
        <div class="awards">
            <span v-on:click="toggleDisplayed()">Awards List</span>
            <ul v-if="displayed === true">
                <li v-for="award in awards_list">
                    {{award.name}}: {{award.description}}
                </li>
            </ul>
        </div>
    </div>
    `
});

