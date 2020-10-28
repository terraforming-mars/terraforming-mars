import Vue from "vue";
import { CardSpecialType } from "../../cards/CardSpecialType";
import { CardSpecial } from "../../cards/CardSpecial";
import { ComponentSize } from "./ComponentSize";

export const CardSpecialComponent = Vue.component("CardSpecialComponent", {
    props: {
        item: {
            type: Object as () => CardSpecial,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            const type: CardSpecialType = this.item.getType();
            const size: ComponentSize = this.item.getSize();
            const classes: Array<string> = ["card-special"];
            if (type === CardSpecialType.ASTERIX) {
                classes.push("card-asterix");
            } else if (type === CardSpecialType.MINUS) {
                classes.push("card-minus");
            } else if (type === CardSpecialType.PLUS) {
                classes.push("card-plus");
                if (size === ComponentSize.SMALL) {
                    classes.push("card-plus--small");
                }
            } else if (type === CardSpecialType.OR) {
                classes.push("card-or");
                if (size === ComponentSize.SMALL) {
                    classes.push("card-or--small");
                }
            } else if (type === CardSpecialType.COLON) {
                classes.push("card-colon");
            } else if (type === CardSpecialType.ARROW) {
                classes.push("card-red-arrow");
            }

            return classes.join(" ");
        },
        getContent: function (): string {
            if (this.item.getIsIcon()) {
                return "";
            } else {
                return this.item.getType();
            }
        },
    },
    template: `
        <div v-html="getContent()" :class="getClasses()" />
    `,
});
