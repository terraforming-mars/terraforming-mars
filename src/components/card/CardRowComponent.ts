import Vue from "vue";
import { CardRenderItem } from "../../cards/render/CardRenderItem";
import { CardRenderProductionBox } from "../../cards/render/CardRenderer";
import { CardRenderItemComponent } from "./CardRenderItemComponent";
import { CardProductionBoxComponent } from "./CardProductionBoxComponent";

// import {
//     CardBonusGlobal,
//     CardBonusResource,
//     CardBonusCard,
//     CardBonusResourceAdditional,
//     CardBonusColonySpecial,
//     CardBonusTag,
//     CardBonusTurmoilSpecial,
// } from "../../cards/CardBonus";
// import { CardSpecial } from "../../cards/CardSpecial";
// import { CardEffect, CardAction } from "../../cards/CauseAndEffect";
// import { CardProductionBox } from "../../cards/CardProductionBox";
// import { CardProductionBoxComponent } from "./CardProductionBoxComponent";
// import { CardBonusGlobalComponent } from "./CardBonusGlobalComponent";
// import { CardSpecialComponent } from "./CardSpecialComponent";
// import { CardBonusResourceComponent } from "./CardBonusResourceComponent";
// import { CardTurmoilSpecialComponent } from "./CardTurmoilSpecialComponent";
// import { CardCauseAndEffectComponent } from "./CardCauseAndEffectComponent";

export const CardRowComponent = Vue.component("CardRowComponent", {
    props: {
        data: {
            type: Object as () => CardRenderItem,
            required: true,
        },
    },
    components: {
        CardRenderItemComponent,
        CardProductionBoxComponent,
        // CardBonusResourceComponent,
        // CardSpecialComponent,
        // CardProductionBoxComponent,
        // CardCauseAndEffectComponent,
        // CardTurmoilSpecialComponent,
    },
    methods: {
        isItem: function (): boolean {
            return this.data instanceof CardRenderItem;
        },
        // isGlobal: function (): boolean {
        //     return this.data instanceof CardBonusGlobal;
        // },
        // isColonySpecial: function (): boolean {
        //     return this.data instanceof CardBonusColonySpecial;
        // },
        // isTurmoilSpecial: function (): boolean {
        //     return this.data instanceof CardBonusTurmoilSpecial;
        // },
        // isSpecial: function (): boolean {
        //     return this.data instanceof CardSpecial;
        // },
        // isResource: function (): boolean {
        //     return (
        //         this.data instanceof CardBonusResource ||
        //         this.data instanceof CardBonusResourceAdditional ||
        //         this.data instanceof CardBonusCard ||
        //         this.data instanceof CardBonusTag
        //     );
        // },
        isProduction: function (): boolean {
            return this.data instanceof CardRenderProductionBox;
        },
        // isCauseAndEffect: function (): boolean {
        //     return this.data instanceof CardEffect || this.data instanceof CardAction;
        // },
    },
    mounted: function () {
        // console.log(this.data instanceof CardRenderItem);
        // console.log(this.data);
    },
    template: ` 
        <CardRenderItemComponent v-if="isItem()" :item="data"/>
        <CardProductionBoxComponent v-else-if="isProduction()" :data="data.rows" />
        <div v-else>n/a</div>
    `,
});
