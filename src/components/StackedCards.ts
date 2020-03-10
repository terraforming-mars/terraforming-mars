import Vue from "vue";
import { CardType } from '../cards/CardType';
import { CardModel } from '../models/CardModel';

export const StackedCards = Vue.component("stacked-cards", {
    props: ["cards"],
    methods: {
        getStackedCards: function() {
            let cards: Array<CardModel> = [];
            for (let index = 0; index < this.cards.length; index++) {
                if (this.cards[index].cardType === CardType.AUTOMATED || this.cards[index].cardType === CardType.PRELUDE) {
                    cards.push(this.cards[index]);
                } 
            }
            return cards;
        }
    },
    template: `
    <div class="cardbox">
        <div v-for="(card, index) in getStackedCards()" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <card :card="card.name" ></card>
        </div>
    </div>
    `
});