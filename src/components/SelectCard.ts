
import Vue from "vue";

interface SelectCardModel {
    cards: Array<string>;
}

import { Card } from "./Card";

export const SelectCard = Vue.component("select-card", {
    props: ["playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            cards: []
        } as SelectCardModel;
    },
    components: {
        "card": Card
    },
    methods: {
        saveData: function () {
            this.onsave([Array.isArray(this.$data.cards) ? this.$data.cards : [this.$data.cards]]);
        }
    },
    template: `<div>
  <div v-if="showtitle === true" class="nofloat">{{playerinput.title}}</div>
  <label v-for="card in playerinput.cards" :key="card" class="cardbox">
    <input v-if="playerinput.maxCardsToSelect === 1 && playerinput.minCardsToSelect === 1" class="nes-radio" type="radio" v-model="cards" :value="card" />
    <input v-else class="nes-checkbox" type="checkbox" v-model="cards" :value="card" :disabled="cards.length >= playerinput.maxCardsToSelect && cards.indexOf(card) === -1" />
    <card :card="card"></card>
  </label>
  <div v-if="showsave === true" class="nofloat">
    <button class="nes-btn" v-on:click="saveData">Save</button>
  </div>
</div>`
});

