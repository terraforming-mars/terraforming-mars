import Vue from "vue";
import { RequirementType } from "../../cards/RequirementType";
import { CardBonusColonySpecial } from "../../cards/CardBonus";

export const CardColonySpecialComponent = Vue.component("CardColonySpecialComponent", {
    props: {
        item: {
            type: Object as () => CardBonusColonySpecial,
        },
    },
    methods: {
        getComponentClasses: function (): string {
            const type: RequirementType = this.item.getResourceType();
            const classes: Array<string> = ["card-colony-special"];
            if (type === RequirementType.TRADE) {
                classes.push("card-resource-trade");
            } else if (type === RequirementType.TRADE_DISCOUNT) {
                classes.push("card-resource");
                classes.push("card-resource-trade-discount");
            } else if (type === RequirementType.TRADE_FLEET) {
                classes.push("card-resource-trade-fleet");
            }

            return classes.join(" ");
        },
        getAmount: function (): number {
            return this.item.getAmount() < 0 ? 1 : this.item.getAmount();
        },
        getContent: function (): string {
            return this.item.getResourceType() === RequirementType.TRADE_DISCOUNT
                ? this.item.getAmount().toString()
                : "";
        },
    },
    template: `
        <div class="card-bonus-container">
            <div v-for="index in getAmount()" v-html="getContent()" :class="getComponentClasses()"/>
        </div>
    `,
});
