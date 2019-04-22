
import Vue from "vue";

interface SelectCardModel {
    cards: Array<string>;
}

import { Card } from "./Card";

export const SelectCard = Vue.component("select-card", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            cards: []
        } as SelectCardModel;
    },
    components: {
        "card": Card
    },
    methods: {
        selectCards: function () {
            this.onsave([Array.isArray(this.$data.cards) ? this.$data.cards : [this.$data.cards]]);
        }
    },
    template: `
        <div>
            <div>{{playerinput.title}} - {{playerinput.message}}</div>
            <label v-for="card in playerinput.cards" :key="card" style="display:block;font-size:12px">
                <input v-if="playerinput.maxCardsToSelect === 1 && playerinput.minCardsToSelect === 1" class="nes-radio" type="radio" v-model="cards" :value="card" />
                <input v-else class="nes-checkbox" type="checkbox" v-model="cards" :value="card" />
                <card :card="card"></card>
            </label>
            <button class="nes-btn" v-on:click="selectCards">Save</button>
        </div>
    `
});

