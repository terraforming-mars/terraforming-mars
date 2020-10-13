import Vue from "vue";
import { Card } from "./card/Card";

export const StackedCards = Vue.component("stacked-cards", {
    props: ["cards"],
    components: {
        Card
    },
    template: `
    <div class="cardbox">
        <div v-for="(card, index) in cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <Card :card="card" />
        </div>
    </div>
    `,
});
