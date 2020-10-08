import Vue from "vue";

export const CardTag = Vue.component("CardTag", {
    props: {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            return ["title"].join(" ");
        },
    },
    template: `
        <div :class="getClasses()"><span v-i18n>{{ title }}</div>
    `,
});
