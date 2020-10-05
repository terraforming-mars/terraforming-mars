import Vue from "vue";
import { Card } from "./Card";
import { ALL_PRELUDE_PROJECTS_CARDS, ALL_VENUS_PROJECTS_CARDS, ALL_COLONIES_PROJECTS_CARDS, ALL_TURMOIL_PROJECTS_CARDS, ALL_PROMO_PROJECTS_CARDS, ALL_PROJECT_CARDS, ALL_CORP_ERA_PROJECT_CARDS, ALL_ARES_PROJECT_CARDS } from '../Dealer';
import { CardName } from "../CardName";

export const DebugUI = Vue.component("debug-ui", {
    components: {
        Card,
    },
    data: function() {
        return {
          filterText: ""
        }
    },
    methods: {
        getAllCards: function () {
            const allItems: Array<CardName> = [
                ...ALL_PRELUDE_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_VENUS_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_COLONIES_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_TURMOIL_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_PROMO_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_PROJECT_CARDS.map((cf) => cf.cardName),
                ...ALL_CORP_ERA_PROJECT_CARDS.map((cf) => cf.cardName),
                ...ALL_ARES_PROJECT_CARDS.map((cf) => cf.cardName)
            ].sort();
            return allItems;
        },
        filtered: function(cardName: string):boolean {
            return this.$data.filterText.length == 0 || cardName.toUpperCase().indexOf(this.$data.filterText.toUpperCase()) > -1;
        }
    },
    template: `
        <div class="debug-ui-container">
            Filter: <input v-model="filterText">
            <section class="debug-ui-cards-list">
                <h2>Cards list</h2>
                <div style="display: inline-block; vertical-align: top;" v-for="card in getAllCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
        </div>
    `
})