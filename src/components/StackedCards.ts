import Vue from "vue";

export const StackedCards = Vue.component("stacked-cards", {
    props: ["cards"],
    template: `
    <div>
        <div v-for="(card, index) in cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <card v-if="card.cardType === 'green' || card.cardType === 'pink' " :card="card.name"  ></card>
        </div>
    </div>
    `
});