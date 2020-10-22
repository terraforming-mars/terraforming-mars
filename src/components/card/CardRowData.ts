import Vue from "vue";
import { CardRow } from "../../cards/CardRow";
import { CardRowComponent } from "./CardRowComponent";

export const CardRowData = Vue.component("CardRowData", {
    props: {
        data: {
            type: Object as () => CardRow,
            required: true,
        },
    },
    components: {
        CardRowComponent,
    },
    template: `
        <div class="card-row">
            <CardRowComponent v-for="(componentData, i) in data.getData()" :data="componentData" :key="i" />
        </div>
    `,
});
