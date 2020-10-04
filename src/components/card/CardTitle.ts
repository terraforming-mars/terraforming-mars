import Vue from "vue";
import { CardType } from "../../cards/CardType";

export const CardTitle = Vue.component("card-title", {
    props: {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            validator: (card: CardType) =>
                Object.values(CardType).includes(card),
        },
    },
    methods: {
        isCorporation: function(): boolean {
            return this.type === CardType.CORPORATION
        },
        getClasses: function (): string {
            const classes: Array<String> = ["title"];
            
            if(this.type === CardType.AUTOMATED) {
                classes.push("background-color-automated");    
            } else if(this.type === CardType.ACTIVE) {
                classes.push("background-color-active"); 
            } else if(this.type === CardType.EVENT) {
                classes.push("background-color-events")
            } else if(this.type === CardType.PRELUDE) {
                classes.push("background-color-prelude")
            }
            return classes.join(" ");
        },
    },
    template: `
        <div v-if="isCorporation()" class="corporationLabel">CORPORATION</div>
        <div v-else :class="getClasses()">{{ title }}</div>
    `,
});
