import Vue from "vue";

import { ALL_PRELUDE_PROJECTS_CARDS, ALL_VENUS_PROJECTS_CARDS, ALL_COLONIES_PROJECTS_CARDS, ALL_TURMOIL_PROJECTS_CARDS, ALL_PROMO_PROJECTS_CARDS, ALL_PROJECT_CARDS, ALL_CORP_ERA_PROJECT_CARDS } from '../Dealer';
import { CardName } from "../CardName";
import { $t } from "../directives/i18n";

const allItems: Array<CardName> = [
    ...ALL_PRELUDE_PROJECTS_CARDS.map((cf) => cf.cardName),
    ...ALL_VENUS_PROJECTS_CARDS.map((cf) => cf.cardName),
    ...ALL_COLONIES_PROJECTS_CARDS.map((cf) => cf.cardName),
    ...ALL_TURMOIL_PROJECTS_CARDS.map((cf) => cf.cardName),
    ...ALL_PROMO_PROJECTS_CARDS.map((cf) => cf.cardName),
    ...ALL_PROJECT_CARDS.map((cf) => cf.cardName),
    ...ALL_CORP_ERA_PROJECT_CARDS.map((cf) => cf.cardName)
].sort();

interface CardsFilterModel {
    customCorporationsList: boolean;
    selectedCardNames: Array<CardName>;
    foundCardNames: Array<CardName>;
    searchTerm: string;
}

export const CardsFilter = Vue.component("cards-filter", {
    props: ["corporateEra", "prelude", "venusNext", "colonies", "turmoil", "promoCardsOption", "communityCardsOption"],
    data: function () {
        return {
            customCorporationsList: false,
            selectedCardNames: [],
            foundCardNames: [],
            searchTerm: ""
        } as CardsFilterModel
    },
    methods: {
        removeCard: function (cardNameToRemove: CardName) {
            this.selectedCardNames = this.selectedCardNames.filter((curCardName) => curCardName !== cardNameToRemove).sort();
        },
        addCard: function (cardNameToAdd: CardName) {
            if (this.selectedCardNames.includes(cardNameToAdd)) return;
            this.selectedCardNames.push(cardNameToAdd);
            this.selectedCardNames = this.selectedCardNames.sort();
            this.searchTerm = "";
        },
        getCardsInputPlaceholder: function() {
            return $t("Start typing the card name to exclude");
        }
    },
    watch: {
        selectedCardNames: function (value) {
            this.$emit("cards-list-changed", value);
        },
        searchTerm: function (value) {
            if (value === "") {
                this.foundCardNames = [];
                return;
            }
            const newCardNames = allItems.filter(
                (candidate: CardName) => ! this.selectedCardNames.includes(candidate) && candidate.toLowerCase().indexOf(value.toLowerCase()) !== -1
            ).sort();
            this.foundCardNames = newCardNames.slice(0, 5)
        }
    },
    template: `
    <div class="cards-filter">
        <h2 v-i18n>Cards to exclude from the game</h2>
        <div class="cards-filter-results-cont" v-if="selectedCardNames.length">
            <div class="cards-filter-result" v-for="cardName in selectedCardNames">
                <label>{{ cardName }}</label>
                <button class="btn btn-error btn-sm" v-on:click.prevent="removeCard(cardName)"><i class="icon icon-cross"></i></button> 
            </div>
        </div>
        <div class="cards-filter-input">
            <div>
                <input class="form-input" :placeholder="getCardsInputPlaceholder()" v-model="searchTerm" />
            </div>
            <div class="cards-filter-suggest" v-if="foundCardNames.length">
                <div class="cards-filter-suggest-item" v-for="cardName in foundCardNames">
                    <a href="#" v-on:click.prevent="addCard(cardName)">{{ cardName }}</a> 
                </div>
            </div>
        </div>
    </div>
    `
});
