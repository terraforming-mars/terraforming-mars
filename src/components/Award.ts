 /**
  * This component show the award list
  */

import Vue from "vue";

export const Award = Vue.component("award", {
    props: ["awards_list"],
    methods: {
        toggleMe: function () {
            let currentState: boolean = this.isVisible();
            (this.$root as any).setVisibilityState("awards_list", ! currentState);
        },
        isVisible: function () {
            return (this.$root as any).getVisibilityState("awards_list");
        }
    },
    template: `
    <div class="awards_cont">
        <div class="awards">
            <a href="#" v-on:click.prevent="toggleMe()" v-i18n>Awards List</a>
            <ul v-show="isVisible()">
                <li v-for="award in awards_list" :class="award.player ? 'pwned-item': ''">
                    <strong v-i18n>{{award.award.name}}</strong>
                    <span v-if="award.player">
                        (<span v-i18n>funded by</span> {{ award.player }})
                    </span>
                    — <span v-i18n>{{award.award.description}}</span>
                </li>
            </ul>
        </div>
    </div>
    `
});

