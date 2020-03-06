 /**
  * This component show the award list
  */

import Vue from "vue";

export const Award = Vue.component("award", {
    props: ["awards_list", "expanded"],
    template: `
    <div class="awards_cont">
        <div class="awards">
            <span v-on:click="expanded=!expanded">Awards List</span>
            <ul v-show="expanded === true">
                <li v-for="award in awards_list">
                    <strong>{{award.name}}</strong> — {{award.description}}
                </li>
            </ul>
        </div>
    </div>
    `
});

