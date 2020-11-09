import Vue from "vue";
import { CardRenderSymbolType } from "../../cards/render/CardRenderSymbolType";
import { CardRenderSymbol } from "../../cards/render/CardRenderSymbol";
import { CardRenderItemSize } from "../../cards/render/CardRenderItemSize";

export const CardRenderSymbolComponent = Vue.component("CardRenderSymbolComponent", {
    props: {
        item: {
            type: Object as () => CardRenderSymbol,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            const type: CardRenderSymbolType = this.item.getType();
            const size: CardRenderItemSize = this.item.getSize();
            const classes: Array<string> = ["card-special"];
            if (type === CardRenderSymbolType.ASTERIX) {
                classes.push("card-asterix");
            } else if (type === CardRenderSymbolType.MINUS) {
                classes.push("card-minus");
            } else if (type === CardRenderSymbolType.PLUS) {
                classes.push("card-plus");
                if (size === CardRenderItemSize.SMALL) {
                    classes.push("card-plus--small");
                }
            } else if (type === CardRenderSymbolType.OR) {
                classes.push("card-or");
                if (size === CardRenderItemSize.SMALL) {
                    classes.push("card-or--small");
                }
            } else if (type === CardRenderSymbolType.COLON) {
                classes.push("card-colon");
            } else if (type === CardRenderSymbolType.ARROW) {
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
    mounted: function () {
        console.log(this.item, "ZE ITEM");
    },
    template: `
        <div v-html="getContent()" :class="getClasses()" />
    `,
});
