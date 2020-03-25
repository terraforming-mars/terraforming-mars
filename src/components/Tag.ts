import Vue from "vue";

export const Tag = Vue.component("tag", {
    props: ["tag"],
    template: `
    <div :class="'tag-count tag-'+tag"></div>
    `
});