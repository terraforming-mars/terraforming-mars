import Vue from "vue";

export const StackedCards = Vue.component("stacked-cards", {
    props: ["cards"],
    template: `
    <div class="cardbox">
        <div v-for="(card, index) in cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <card :card="card"></card>
        </div>
    </div>
    `
});