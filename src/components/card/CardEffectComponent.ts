import Vue from "vue";
import { CardEffect } from "../../cards/CardEffect";
import { CardBonusResourceComponent } from "./CardBonusResourceComponent";
import { CardSpecialComponent } from "./CardSpecialComponent";
import { CardBonusGlobalComponent } from "./CardBonusGlobalComponent";
import { CardProductionBoxComponent } from "./CardProductionBoxComponent";
import { CardColonySpecialComponent } from "./CardColonySpecialComponent";
import { CardSpecial } from "../../cards/CardSpecial";
import { CardDescription } from "./CardDescription";
import { CardProductionBox } from "../../cards/CardProductionBox";
import {
    CardBonusResource,
    CardBonusResourceAdditional,
    CardBonusCard,
    CardBonusGlobal,
    CardBonusColonySpecial,
    CardBonusTag,
    CardBonusTurmoilSpecial,
} from "../../cards/CardBonus";

export const CardEffectComponent = Vue.component("CardEffectComponent", {
    props: {
        data: {
            type: Object as () => CardEffect,
            required: true,
        },
    },
    components: {
        CardBonusResourceComponent,
        CardSpecialComponent,
        CardBonusGlobalComponent,
        CardDescription,
        CardProductionBoxComponent,
        CardColonySpecialComponent,
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<string> = ["card-effect-box"];
            return classes.join(" ");
        },
        getComponentType: function (
            rowItem:
                | CardSpecial
                | CardBonusResource
                | CardBonusResourceAdditional
                | CardBonusCard
                | CardBonusGlobal
                | CardProductionBox
                | CardBonusColonySpecial
                | CardBonusTurmoilSpecial
        ): string {
            if (rowItem instanceof CardSpecial) {
                return "special";
            } else if (
                rowItem instanceof CardBonusResource ||
                rowItem instanceof CardBonusResourceAdditional ||
                rowItem instanceof CardBonusCard ||
                rowItem instanceof CardBonusTag
            ) {
                return "resource";
            } else if (rowItem instanceof CardBonusGlobal) {
                return "global";
            } else if (rowItem instanceof CardProductionBox) {
                return "production";
            } else if (rowItem instanceof CardBonusColonySpecial) {
                return "colony_special";
            } else if (rowItem instanceof CardBonusTurmoilSpecial) {
                return "turmoil_special";
            }
            return "";
        },
    },
    //TODO (chosta): refactor card-effect-box to be a reusable Vue component
    template: `
        <div :class="getClasses()">
            <div class="card-effect-box-row">
                <div v-if="data.getDelimiter() !== undefined" class="card-effect-box-content">
                    <div v-for="(rowItem, rowIndex) in data.condition" class="card-effect-box-item" :key="rowIndex">
                        <CardBonusResourceComponent v-if="getComponentType(rowItem) === 'resource'" :item="rowItem"/>
                        <CardBonusGlobalComponent v-else-if="getComponentType(rowItem) === 'global'" :item="rowItem"/>
                        <CardSpecialComponent v-else-if="getComponentType(rowItem) === 'special'" :item="rowItem" />
                        <CardColonySpecialComponent v-else-if="getComponentType(rowItem) === 'colony_special'" :item="rowItem" />
                        <div v-else>n/a</div>
                    </div>
                </div>
                <CardSpecialComponent v-if="data.delimiter !== undefined" :item="data.delimiter" />
                <div class="card-effect-box-content">
                    <div v-for="(rowItem, rowIndex) in data.effect" class="card-effect-box-item" :key="rowIndex">
                        <CardBonusResourceComponent v-if="getComponentType(rowItem) === 'resource'" :item="rowItem"/>
                        <CardBonusGlobalComponent v-else-if="getComponentType(rowItem) === 'global'" :item="rowItem"/>
                        <CardSpecialComponent v-else-if="getComponentType(rowItem) === 'special'" :item="rowItem" />
                        <CardProductionBoxComponent v-else-if="getComponentType(rowItem) === 'production'" :data="rowItem.getData()" />
                        <CardColonySpecialComponent v-else-if="getComponentType(rowItem) === 'colony_special'" :item="rowItem" />
                        <CardTurmoilSpecialComponent v-else-if="getComponentType(rowItem) === 'turmoil_special'" :item="rowItem" />
                        <div v-else>n/a</div>
                    </div>
                </div>
            </div>
            <CardDescription :text="data.getDescriptionParsed()" />
        </div>
    `,
});
