import Vue from "vue";
import { Tag } from './Tag';

export const TagCount = Vue.component("tag-count", {
    props: ["tag", "count"],
    components: {
        "tag": Tag
    },    
    template: `
    <div class="tag-display">
        <tag :tag="tag"></tag>
        <span class="tag-count-display">{{count}}</span>
    </div>
    `
});