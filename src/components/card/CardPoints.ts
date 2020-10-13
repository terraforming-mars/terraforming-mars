import Vue from "vue";
//#TODO implement points per tag
export const CardPoints = Vue.component("CardPoints", {
    props: {
        amount: {
            type: Number,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            const classes = ["points", "points-big"];

            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()">{{ amount }}</div>
    `,
});
