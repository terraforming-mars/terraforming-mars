 /**
  * This component show the award list
  */

import Vue from "vue";

export const Award = Vue.component("award", {
    props: ["awards_list"],
    data: function () {
        return {
            displayed: false,
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

