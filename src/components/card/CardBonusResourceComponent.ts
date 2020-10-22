import Vue from "vue";
import { Resources } from "../../Resources";
import { CardSpecialType } from "../../cards/CardSpecialType";
import  { CardBonusResource } from "../../cards/CardBonus";

export const CardBonusResourceComponent = Vue.component("CardBonusResourceComponent", {
    props: {
        item: {
            type: Object as () => CardBonusResource
        },
    },
    methods: {
        getComponentClasses: function (): string {
            const type: Resources = this.item.getResourceType();
            const classes: Array<string> = ["card-resource"];
            if (type === Resources.TITANIUM) {
                classes.push("card-resource-titanium");
            } else if (type === Resources.PLANTS) {
                classes.push("card-resource-plant");
            } else if (type === Resources.MEGACREDITS) {
                classes.push("card-resource-money");
            } else if (type === Resources.HEAT) {
                classes.push("card-resource-heat");
            } else if (type === Resources.STEEL) {
                classes.push("card-resource-steel");
            } else if (type === Resources.ENERGY) {
                classes.push("card-resource-energy");
            }
            if (this.item.getAnyPlayer() === true) {
                classes.push("red-outline");
            }
            return classes.join(" ");
        },
        getAmountAbs: function (): number {
            return Math.abs(this.item.getAmount());
        },
        getMinus: function (): string {
            return CardSpecialType.MINUS;
        },
        isSubtract: function (): boolean {
            return this.item.getAmount() < 0 && !this.item.getIsAmountInside();
        },
        showNumber: function (): boolean {
            return this.getAmountAbs() > 5;
        },
        itemsToShow: function (): number {
            if (this.showNumber()) return 1;
            if (this.item.getIsAmountInside()) return 1;

            return this.getAmountAbs();
        },
        itemContent: function(): string {
            if (this.item.getIsAmountInside()) return this.item.getAmount().toString();
            return "";
        }
    },
    template: `
        <div class="card-bonus-container">
            <CardSpecialComponent v-if="isSubtract()" :type="getMinus()" />
            <div class="card-res-amount" v-if="showNumber()">{{ getAmountAbs() }}</div>
            <div v-for="index in itemsToShow()" :class="getComponentClasses()">{{ itemContent() }}</div>
        </div>
    `,
});
