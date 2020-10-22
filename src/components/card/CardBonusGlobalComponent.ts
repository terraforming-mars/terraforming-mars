import Vue from "vue";
import { RequirementType } from "../../cards/RequirementType";
import { CardBonusGlobal } from "../../cards/CardBonus";

export const CardBonusGlobalComponent = Vue.component("CardBonusGlobalComponent", {
    props: {
        item: {
            type: Object as () => CardBonusGlobal
        }
    },
    methods: {
        getComponentClasses: function (): string {
            const type: RequirementType = this.item.getGlobalRequirementType();
            const classes: Array<string> = ["card-global-requirement"];
            if (type === RequirementType.OCEANS) {
                classes.push("card-ocean-global-requirement");
            } else if (type === RequirementType.TEMPERATURE) {
                classes.push("card-temperature-global-requirement");
            } else if (type === RequirementType.VENUS) {
                classes.push("card-venus-global-requirement");
            }
            return classes.join(" ");
        },
    },
    template: `
        <div class="card-bonus-container">
            <div v-for="index in item.getAmount()" :class="getComponentClasses()"/>
        </div>
    `,
});
