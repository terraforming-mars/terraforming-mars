import Vue from "vue";
import { Card } from "./Card";
import { CardName } from "../CardName";
import { PRELUDE_CARD_MANIFEST } from "../cards/prelude/PreludeCardManifest";
import { VENUS_CARD_MANIFEST } from "../cards/venusNext/VenusCardManifest";
import { COLONIES_CARD_MANIFEST } from "../cards/colonies/ColoniesCardManifest";
import { TURMOIL_CARD_MANIFEST } from "../cards/turmoil/TurmoilCardManifest";
import { PROMO_CARD_MANIFEST } from "../cards/promo/PromoCardManifest";
import { BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST } from "../cards/StandardCardManifests";
import { COMMUNITY_CARD_MANIFEST } from "../cards/community/CommunityCardManifest";

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
                ...PRELUDE_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName),
                ...VENUS_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName),
                ...COLONIES_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName),
                ...TURMOIL_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName),
                ...PROMO_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName),
                ...BASE_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName),
                ...CORP_ERA_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName),
                ...COMMUNITY_CARD_MANIFEST.projectCards.cards.map((cf) => cf.cardName)
            ].sort();
            return allItems;
        },
        getAllCorporationCards: function () {
            const allItems: Array<CardName> = [
                ...PRELUDE_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName),
                ...VENUS_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName),
                ...COLONIES_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName),
                ...TURMOIL_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName),
                ...PROMO_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName),
                ...BASE_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName),
                ...CORP_ERA_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName),
                ...COMMUNITY_CARD_MANIFEST.corporationCards.cards.map((cf) => cf.cardName)
            ].sort();
            return allItems;
        },
        getAllPreludeCards: function () {
            const allItems: Array<CardName> = [
                ...PRELUDE_CARD_MANIFEST.preludeCards.cards.map((cf) => cf.cardName),
                ...COMMUNITY_CARD_MANIFEST.preludeCards.cards.map((cf) => cf.cardName),
            ].sort();
            return allItems;
        },
        filtered: function(cardName: string):boolean {
            return this.$data.filterText.length === 0 || cardName.toUpperCase().indexOf(this.$data.filterText.toUpperCase()) > -1;
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