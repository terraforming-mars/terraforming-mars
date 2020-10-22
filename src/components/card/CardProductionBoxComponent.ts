import Vue from "vue";
import { CardProductionBox } from "../../cards/CardProductionBox";
import { CardBonusResourceComponent } from "./CardBonusResourceComponent";
import { CardSpecialComponent } from "./CardSpecialComponent";
import { CardSpecial } from "../../cards/CardSpecial";
import { CardBonusResource } from "../../cards/CardBonus";

export const CardProductionBoxComponent = Vue.component("CardProductionBoxComponent", {
    props: {
        data: {
            type: Object as () => CardProductionBox,
            required: true,
        },
    },
    components: {
        CardBonusResourceComponent,
        CardSpecialComponent,
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<string> = ["card-production-box"];
            return classes.join(" ");
        },
        getComponentType: function (rowItem: CardSpecial | CardBonusResource): string {
            if (rowItem instanceof CardSpecial) {
                return "special";
            } else if (rowItem instanceof CardBonusResource) {
                return "resource";
            }
            return "";
        },
    },
    mounted: function () {
        console.log(this.data);
    },
    template: `
        <div :class="getClasses()">
            <div class="card-production-box-row" v-for="(rowData, index) in data" :key="index">
                <div v-for="(rowItem, rowIndex) in rowData" class="card-production-box-row-item" :key="rowIndex">
                    <CardBonusResourceComponent v-if="getComponentType(rowItem) === 'resource'" :item="rowItem"/>
                    <CardSpecialComponent v-else-if="getComponentType(rowItem) === 'special'" :type="rowItem.getType()" />
                    <div v-else>n/a</div>
                </div>
            </div>
        </div>
    `,
});
