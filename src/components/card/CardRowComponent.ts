import Vue from "vue";
import {
    CardBonusGlobal,
    CardBonusResource,
    CardBonusCard,
    CardBonusResourceAdditional,
} from "../../cards/CardBonus";
import { CardSpecial } from "../../cards/CardSpecial";
import { CardProductionBox } from "../../cards/CardProductionBox";
import { CardProductionBoxComponent } from "./CardProductionBoxComponent";
import { CardBonusGlobalComponent } from "./CardBonusGlobalComponent";
import { CardSpecialComponent } from "./CardSpecialComponent";
import { CardBonusResourceComponent } from "./CardBonusResourceComponent";

export const CardRowComponent = Vue.component("CardRowComponent", {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    components: {
        CardBonusGlobalComponent,
        CardBonusResourceComponent,
        CardSpecialComponent,
        CardProductionBoxComponent,
    },
    methods: {
        isGlobal: function (): boolean {
            return this.data instanceof CardBonusGlobal;
        },
        isSpecial: function (): boolean {
            return this.data instanceof CardSpecial;
        },
        isResource: function (): boolean {
            return (
                this.data instanceof CardBonusResource ||
                this.data instanceof CardBonusResourceAdditional ||
                this.data instanceof CardBonusCard
            );
        },
        isProduction: function (): boolean {
            return this.data instanceof CardProductionBox;
        },
    },
    template: `
        <CardBonusGlobalComponent v-if="isGlobal()" :item="data"/>
        <CardBonusResourceComponent v-else-if="isResource()" :item="data"/>
        <CardSpecialComponent v-else-if="isSpecial()" :item="data" />
        <CardProductionBoxComponent v-else-if="isProduction()" :data="data.getData()" />
        <div v-else>n/a</div>
    `,
});
