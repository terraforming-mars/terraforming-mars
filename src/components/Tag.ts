import Vue from "vue";

export const Tag = Vue.component("tag", {
    props: ["tag", "size", "type"],
    methods: {
        getClasses: function (): string {
            let classes = ["tag-count"];
            classes.push(`tag-${this.tag}`);
            if (this.size !== undefined) {
                classes.push(`tag-size-${this.size}`);
            }
            if (this.type !== undefined) {
                classes.push(`tag-type-${this.type}`);
            }

            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()" />
    `,
});
