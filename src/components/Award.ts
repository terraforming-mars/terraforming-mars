 /**
  * This component show the award list
  */

import Vue from "vue";
import { ORIGINAL_AWARDS } from "../awards/Awards";

export const Award = Vue.component("award", {
    data: function () {
        return {
            "awards_list": ORIGINAL_AWARDS
        };
    },
    template: `
    <div class="awards_cont">
        <div class="awards">
            <span>Awards:</span>
            <ul>
                <li v-for="award in awards_list">
                    {{award.name}} : {{award.description}}
                </li>
            </ul>
        </div>
    </div>
    `
});

