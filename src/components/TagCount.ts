import Vue from "vue";
import { Tag } from "./Tag";

export const TagCount = Vue.component("tag-count", {
    props: {
        tag: {
            type: String
        },
        count: {
            type: Number
        },
        size: {
            type: String
        },
        type: {
            type: String
        },
        hideCount: {
            required: false,
            type: Boolean
        }
    },
    components: {
        "tag": Tag,
    },
    methods: {
        getClasses: function (): string {
            let classes = ["tag-display"];
            if (this.count === 0) {
                classes.push("tag-no-show");
            }
            return classes.join(" ");
        },
        getCountClasses: function (): string {
            let classes = ["tag-count-display"];
            if (this.count === 0) {
                classes.push("tag-count-no-show");
            }

            return classes.join(" ");
        },
        getCount: function (): number | string {
            return this.hideCount === true ? "?" : this.count;
        },
    },
    template: `<div :class="getClasses()">
        <tag :tag="tag" :size="size" :type="type"/>
        <span :class="getCountClasses()">{{ getCount() }}</span>
    </div>`
});
