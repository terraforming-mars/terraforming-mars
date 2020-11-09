import Vue from "vue";
import { CardRenderItem } from "../../cards/render/CardRenderItem";
import { CardRenderItemType } from "../../cards/render/CardRenderItemType";
import { CardRenderSymbol } from "../../cards/render/CardRenderSymbol";
import { CardRenderSymbolComponent } from "./CardRenderSymbolComponent";

export const CardRenderItemComponent = Vue.component("CardRenderItemComponent", {
    props: {
        item: {
            type: Object as () => CardRenderItem,
        },
    },
    components: {
        CardRenderSymbolComponent,
    },
    methods: {
        getComponentClasses: function (): string {
            const classes: Array<string> = [""];
            if (this.item.type === CardRenderItemType.TEMPERATURE) {
                // global
                classes.push("card-global-requirement");
                classes.push("card-temperature-global-requirement");
            } else if (this.item.type === CardRenderItemType.OXYGEN) {
                classes.push("card-global-requirement");
                classes.push("card-oxygen-global-requirement");
            } else if (this.item.type === CardRenderItemType.OCEANS) {
                classes.push("card-global-requirement");
                classes.push("card-ocean-global-requirement");
            } else if (this.item.type === CardRenderItemType.VENUS) {
                classes.push("card-global-requirement");
                classes.push("card-venus-global-requirement");
            } else if (this.item.type === CardRenderItemType.TITANIUM) {
                // resources
                classes.push("card-resource");
                classes.push("card-resource-titanium");
            } else if (this.item.type === CardRenderItemType.HEAT) {
                classes.push("card-resource");
                classes.push("card-resource-heat");
            } else if (this.item.type === CardRenderItemType.ENERGY) {
                classes.push("card-resource");
                classes.push("card-resource-energy");
            } else if (this.item.type === CardRenderItemType.PLANTS) {
                classes.push("card-resource");
                classes.push("card-resource-plant");
            }

            // act upon any player
            if (this.item.anyPlayer === true) {
                classes.push("red-outline");
            }

            return classes.join(" ");
        },
        getAmountAbs: function (): number {
            return Math.abs(this.item.amount);
        },
        getMinus: function (): CardRenderSymbol {
            return CardRenderSymbol.minus();
        },
        isSubtract: function (): boolean {
            return this.item.amount < 0;
        },
        itemsToShow: function (): number {
            if (this.item.showDigit) return 1;
            return this.getAmountAbs();
        },
        itemHtmlContent: function (): string {
            // in case of symbols inside
            if (this.item instanceof CardRenderItem && this.item.amountInside())
                return this.item.amount.toString();

            return "";
        },
    },
    template: `
        <div class="card-item-container">
            <CardRenderSymbolComponent v-if="isSubtract()" :item="getMinus()" />
            <div class="card-res-amount" v-if="item.showDigit">{{ getAmountAbs() }}</div>
            <div :class="getComponentClasses()" v-for="index in itemsToShow()" v-html="itemHtmlContent()" :key="index"/>
        </div>
    `,
});
