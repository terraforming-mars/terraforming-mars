
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
            this.onsave([Array.isArray(this.$data.cards) ? this.$data.cards.map(card => card.name) : [this.$data.cards.name]]);
        }
    },
    template: `<div class="wf-component wf-component--select-card">
        <div v-if="showtitle === true" class="nofloat wf-component-title" v-i18n>{{playerinput.title}}</div>
        <label v-for="card in playerinput.cards" class="cardbox">
            <input v-if="playerinput.maxCardsToSelect === 1 && playerinput.minCardsToSelect === 1" type="radio" v-model="cards" :value="card" />
            <input v-else type="checkbox" v-model="cards" :value="card" :disabled="cards.length >= playerinput.maxCardsToSelect && cards.indexOf(card) === -1" />
            <card :card="card"></card>
        </label>
        <div v-if="showsave === true" class="nofloat">
            <button class="btn btn-primary" v-on:click="saveData">Save</button>
        </div>
    </div>`
});

