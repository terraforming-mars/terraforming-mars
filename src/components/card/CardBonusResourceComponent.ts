import Vue from "vue";
import { Tags } from "../../cards/Tags";
import { Resources } from "../../Resources";
import { ResourceType } from "../../ResourceType";
import { CardSpecial } from "../../cards/CardSpecial";
import {
    CardBonusResource,
    CardBonusResourceAdditional,
    CardBonusCard,
    CardBonusTag,
} from "../../cards/CardBonus";

export const CardBonusResourceComponent = Vue.component("CardBonusResourceComponent", {
    props: {
        item: {
            type: Object as () =>
                | CardBonusResource
                | CardBonusResourceAdditional
                | CardBonusCard
                | CardBonusTag,
        },
    },
    methods: {
        getComponentClasses: function (): string {
            let type: Resources | ResourceType | string;
            if (this.item instanceof CardBonusCard) {
                type = "card";
            } else {
                type = this.item.getResourceType();
            }
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
            } else if (type === "card") {
                classes.push("card-card");
            } else if (type === ResourceType.MICROBE) {
                classes.push("card-resource-microbe");
            } else if (type === ResourceType.ANIMAL) {
                classes.push("card-resource-animal");
            } else if (type === ResourceType.SCIENCE) {
                classes.push("card-resource-science");
            } else if (type === ResourceType.FLOATER) {
                classes.push("card-resource-floater");
            } else if (type === ResourceType.ASTEROID) {
                classes.push("card-resource-asteroid");
            } else if (type === Tags.EVENT) {
                classes.push("card-tag-event");
            }
            // round tags
            if (
                (this.item instanceof CardBonusResource ||
                    this.item instanceof CardBonusResourceAdditional ||
                    this.item instanceof CardBonusTag) &&
                this.item.getIsPlayed()
            ) {
                classes.push("card-resource-tag");
            }
            // affecting any player (red border)
            if (this.item.getAnyPlayer() === true) {
                classes.push("red-outline");
            }
            return classes.join(" ");
        },
        getAmountAbs: function (): number {
            return Math.abs(this.item.getAmount());
        },
        getMinus: function (): CardSpecial {
            return CardSpecial.minus();
        },
        isSubtract: function (): boolean {
            return (
                this.item.getAmount() < 0 &&
                this.item instanceof CardBonusResource &&
                !this.item.getIsAmountInside()
            );
        },
        itemsToShow: function (): number {
            if (this.item.getShowDigit()) return 1;
            if (this.item instanceof CardBonusResource && this.item.getIsAmountInside()) return 1;

            return this.getAmountAbs();
        },
        itemHtmlContent: function (): string {
            // in case of symbols inside
            if (this.item instanceof CardBonusResource && this.item.getIsAmountInside())
                return this.item.getAmount().toString();

            // in case we have a tag dependency
            if (this.item instanceof CardBonusResourceAdditional) {
                const dependency: Tags | undefined = this.item.getTagDependency();
                // TODO (chosta): find a better way to add html content (use Vue components)
                if (dependency === Tags.VENUS) {
                    return "<div class='card-icon tag-venus'></div>";
                }
            }

            return "";
        },
    },
    template: `
        <div class="card-bonus-container">
            <CardSpecialComponent v-if="isSubtract()" :item="getMinus()" />
            <div class="card-res-amount" v-if="item.getShowDigit()">{{ getAmountAbs() }}</div>
            <div v-html="itemHtmlContent()" v-for="index in itemsToShow()" :class="getComponentClasses()" />
        </div>
    `,
});
