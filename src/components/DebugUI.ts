import Vue from "vue";
import { Card } from "./Card";
import { CardName } from "../CardName";
import { PRELUDE_CARD_MANIFEST } from "../cards/prelude/PreludeCardManifest";
import { VENUS_CARD_MANIFEST } from "../cards/venusNext/VenusCardManifest";
import { COLONIES_CARD_MANIFEST } from "../cards/colonies/ColoniesCardManifest";
import { TURMOIL_CARD_MANIFEST } from "../cards/turmoil/TurmoilCardManifest";
import { PROMO_CARD_MANIFEST } from "../cards/promo/PromoCardManifest";
import { BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST } from "../cards/StandardCardManifests";

export const DebugUI = Vue.component("debug-ui", {
    components: {
        Card,
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
            ];
            return allItems;
        }
    },
    template: `
        <div class="debug-ui-container">
            <section class="debug-ui-cards-list">
                <h2>Project Cards</h2>
                <div style="display: inline-block; vertical-align: top;" v-for="card in getAllProjectCards()">
                    <Card :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Corporations</h2>
                <div style="display: inline-block; vertical-align: top;" v-for="card in getAllCorporationCards()">
                    <Card :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Preludes</h2>
                <div style="display: inline-block; vertical-align: top;" v-for="card in getAllPreludeCards()">
                    <Card :card="{'name': card}" />
                </div>
            </section>
        </div>
    `
})