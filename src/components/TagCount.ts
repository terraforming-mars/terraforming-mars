import Vue from "vue";
import { Tag } from "./Tag";

export const TagCount = Vue.component("tag-count", {
    props: ["tag", "count", "size"],
    components: {
        "tag": Tag,
    },
    template: `
    <div class="tag-display">
        <tag :tag="tag" :size="size" />
        <span class="tag-count-display">{{count}}</span>
    </div>
    `,
});
