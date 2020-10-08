import Vue from "vue";
import { Card } from "./Card";
import { ALL_PRELUDE_PROJECTS_CARDS, ALL_VENUS_PROJECTS_CARDS, ALL_COLONIES_PROJECTS_CARDS, ALL_TURMOIL_PROJECTS_CARDS, ALL_PROMO_PROJECTS_CARDS, ALL_PROJECT_CARDS, ALL_CORP_ERA_PROJECT_CARDS, ALL_CORPORATION_CARDS, ALL_CORP_ERA_CORPORATION_CARDS, ALL_VENUS_CORPORATIONS, ALL_PRELUDE_CORPORATIONS, ALL_COLONIES_CORPORATIONS, ALL_TURMOIL_CORPORATIONS, ALL_PROMO_CORPORATIONS, ALL_COMMUNITY_CORPORATIONS, ALL_PRELUDE_CARDS } from '../Dealer';
import { CardName } from "../CardName";

export const DebugUI = Vue.component("debug-ui", {
    components: {
        Card
    },
    data: function() {
        return {
          filterText: ""
        }
    },
    methods: {
        getAllProjectCards: function () {
            const allItems: Array<CardName> = [
                ...ALL_PRELUDE_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_VENUS_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_COLONIES_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_TURMOIL_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_PROMO_PROJECTS_CARDS.map((cf) => cf.cardName),
                ...ALL_PROJECT_CARDS.map((cf) => cf.cardName),
                ...ALL_CORP_ERA_PROJECT_CARDS.map((cf) => cf.cardName),
            ].sort();
            return allItems;
        },
        getAllCorporationCards: function () {
            const allItems: Array<CardName> = [
                ...ALL_CORPORATION_CARDS.map((cf) => cf.cardName),
                ...ALL_CORP_ERA_CORPORATION_CARDS.map((cf) => cf.cardName),
                ...ALL_VENUS_CORPORATIONS.map((cf) => cf.cardName),
                ...ALL_PRELUDE_CORPORATIONS.map((cf) => cf.cardName),
                ...ALL_COLONIES_CORPORATIONS.map((cf) => cf.cardName),
                ...ALL_TURMOIL_CORPORATIONS.map((cf) => cf.cardName),
                ...ALL_PROMO_CORPORATIONS.map((cf) => cf.cardName),
                ...ALL_COMMUNITY_CORPORATIONS.map((cf) => cf.cardName),
            ].sort();
            return allItems;
        },
        getAllPreludeCards: function () {
            const allItems: Array<CardName> = [
                ...ALL_PRELUDE_CARDS.map((cf) => cf.cardName),
            ].sort();
            return allItems;
        },
        filtered: function(cardName: string):boolean {
            return this.$data.filterText.length == 0 || cardName.toUpperCase().indexOf(this.$data.filterText.toUpperCase()) > -1;
        }
    },
    template: `
        <div class="debug-ui-container">
            <input class="form-input form-input-line" placeholder="filter" v-model="filterText">
            <div class="cardbox"" v-for="card in getAllProjectCards()"></div>
            <section class="debug-ui-cards-list">
                <h2>Project Cards</h2>
                <div class="cardbox"" v-for="card in getAllProjectCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Corporations</h2>
                <div class="cardbox"" v-for="card in getAllCorporationCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Preludes</h2>
                <div class="cardbox"" v-for="card in getAllPreludeCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
        </div>
    `
})