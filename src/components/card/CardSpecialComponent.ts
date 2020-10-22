import Vue from "vue";
import { CardSpecialType } from "../../cards/CardSpecialType";

export const CardSpecialComponent = Vue.component("CardSpecialComponent", {
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<String> = ["card-special"];
            if (this.type === CardSpecialType.ASTERIX) {
                classes.push("card-asterix");
            } else if (this.type === CardSpecialType.MINUS) {
                classes.push("card-minus");
            }
            return classes.join(" ");
        },
        isIcon: function (): boolean {
            return this.type !== CardSpecialType.ASTERIX;
        },
    },
    template: `
        <div v-if="isIcon()" :class="getClasses()"/>
        <div v-else :class="getClasses()">{{ type }}</div>
    `,
});
