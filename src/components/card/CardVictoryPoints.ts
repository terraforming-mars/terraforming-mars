import Vue from "vue";
//#TODO implement points per tag
export const CardVictoryPoints = Vue.component("CardVictoryPoints", {
    props: {
        amount: {
            type: Number,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            const classes = ["card-points", "points-big"];

            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()">{{ amount }}</div>
    `,
});
