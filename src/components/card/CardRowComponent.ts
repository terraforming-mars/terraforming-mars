import Vue from "vue";
import {
    CardBonusGlobal,
    CardBonusResource,
    CardBonusCard,
    CardBonusResourceAdditional,
    CardBonusColonySpecial,
    CardBonusTag,
    CardBonusTurmoilSpecial,
} from "../../cards/CardBonus";
import { CardSpecial } from "../../cards/CardSpecial";
import { CardEffect, CardAction } from "../../cards/CauseAndEffect";
import { CardProductionBox } from "../../cards/CardProductionBox";
import { CardProductionBoxComponent } from "./CardProductionBoxComponent";
import { CardBonusGlobalComponent } from "./CardBonusGlobalComponent";
import { CardSpecialComponent } from "./CardSpecialComponent";
import { CardBonusResourceComponent } from "./CardBonusResourceComponent";
import { CardTurmoilSpecialComponent } from "./CardTurmoilSpecialComponent";
import { CardCauseAndEffectComponent } from "./CardCauseAndEffectComponent";

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
        CardCauseAndEffectComponent,
        CardTurmoilSpecialComponent,
    },
    methods: {
        isGlobal: function (): boolean {
            return this.data instanceof CardBonusGlobal;
        },
        isColonySpecial: function (): boolean {
            return this.data instanceof CardBonusColonySpecial;
        },
        isTurmoilSpecial: function (): boolean {
            return this.data instanceof CardBonusTurmoilSpecial;
        },
        isSpecial: function (): boolean {
            return this.data instanceof CardSpecial;
        },
        isResource: function (): boolean {
            return (
                this.data instanceof CardBonusResource ||
                this.data instanceof CardBonusResourceAdditional ||
                this.data instanceof CardBonusCard ||
                this.data instanceof CardBonusTag
            );
        },
        isProduction: function (): boolean {
            return this.data instanceof CardProductionBox;
        },
        isCauseAndEffect: function (): boolean {
            return this.data instanceof CardEffect || this.data instanceof CardAction;
        },
    },
    template: `
        <CardBonusGlobalComponent v-if="isGlobal()" :item="data"/>
        <CardBonusResourceComponent v-else-if="isResource()" :item="data"/>
        <CardSpecialComponent v-else-if="isSpecial()" :item="data" />
        <CardProductionBoxComponent v-else-if="isProduction()" :data="data.getData()" />
        <CardCauseAndEffectComponent v-else-if="isCauseAndEffect()" :data="data" />
        <CardColonySpecialComponent v-else-if="isColonySpecial()" :item="data" />
        <CardTurmoilSpecialComponent v-else-if="isTurmoilSpecial()" :item="data" />
        <div v-else>n/a</div>
    `,
});
