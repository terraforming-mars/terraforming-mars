import Vue from "vue";

export const CardCost = Vue.component("CardCost", {
    props: {
        amount: {
            type: Number,
            required: true,
        },
    },
    template: `
        <div class="card-cost">{{ amount }}</div>
    `,
});
