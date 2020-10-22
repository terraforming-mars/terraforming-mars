import Vue from "vue";
import { CardRowData } from "./CardRowData";

export const CardOnPlayData = Vue.component("CardOnPlayData", {
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    components: {
        CardRowData,
    },
    template: `
        <div class="card-rows">
            <CardRowData v-for="(cardData, i) in data" :data="cardData" :key="i" />
        </div>
    `,
});
