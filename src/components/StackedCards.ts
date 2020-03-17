import Vue from "vue";
<<<<<<< HEAD
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
=======

export const StackedCards = Vue.component("stacked-cards", {
    props: ["cards"],
    template: `
    <div class="cardbox">
        <div v-for="(card, index) in cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
>>>>>>> 89c85cb4c986b4206ed729dad44655797dfae69c
            <card :card="card.name" ></card>
        </div>
    </div>
    `
});