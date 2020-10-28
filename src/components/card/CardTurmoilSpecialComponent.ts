import Vue from "vue";
import { RequirementType } from "../../cards/RequirementType";
import { CardBonusTurmoilSpecial } from "../../cards/CardBonus";

export const CardTurmoilSpecialComponent = Vue.component("CardTurmoilSpecialComponent", {
    props: {
        item: {
            type: Object as () => CardBonusTurmoilSpecial,
        },
    },
    methods: {
        getComponentClasses: function (): string {
            const type: RequirementType = this.item.getResourceType();
            const classes: Array<string> = ["card-turmoil-special"];
            if (type === RequirementType.CHAIRMAN) {
                classes.push("card-chairman");
            } else if (type === RequirementType.PARTY_LEADERS) {
                classes.push("card-party-leader");
            } else if (type === RequirementType.DELEGATES) {
                classes.push("card-delegate");
            } else if (type === RequirementType.INFLUENCE) {
                classes.push("card-influence");
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
