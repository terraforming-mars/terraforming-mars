import Vue from "vue";

import { ALL_VENUS_CORPORATIONS, ALL_PRELUDE_CORPORATIONS, ALL_CORPORATION_CARDS, ALL_COLONIES_CORPORATIONS, ALL_TURMOIL_CORPORATIONS, ALL_PROMO_CORPORATIONS, ALL_CORP_ERA_CORPORATION_CARDS } from '../Dealer';
import { CardName } from "../CardName";
import { CorporationGroup } from "../CorporationName";

const allItems: Array<CardName> = [
    ...ALL_CORPORATION_CARDS.map((cf) => cf.cardName),
    ...ALL_CORP_ERA_CORPORATION_CARDS.map((cf) => cf.cardName),
    ...ALL_PRELUDE_CORPORATIONS.map((cf) => cf.cardName),
    ...ALL_VENUS_CORPORATIONS.map((cf) => cf.cardName),
    ...ALL_COLONIES_CORPORATIONS.map((cf) => cf.cardName),
    ...ALL_TURMOIL_CORPORATIONS.map((cf) => cf.cardName),
    ...ALL_PROMO_CORPORATIONS.map((cf) => cf.cardName)
];

export const CorporationsFilter = Vue.component("corporations-filter", {
    props: ["corporateEra", "prelude", "venusNext", "colonies", "turmoil", "promoCardsOption"],
    data: function () {
        return {
            customCorporationsList: false,
            selectedCorporations: [
                ...this.corporateEra ? ALL_CORPORATION_CARDS.concat(ALL_CORP_ERA_CORPORATION_CARDS).map((cf) => cf.cardName) : [],
                ...this.prelude ? ALL_PRELUDE_CORPORATIONS.map((cf) => cf.cardName) : [],
                ...this.venusNext ? ALL_VENUS_CORPORATIONS.map((cf) => cf.cardName) : [],
                ...this.colonies ? ALL_COLONIES_CORPORATIONS.map((cf) => cf.cardName) : [],
                ...this.turmoil ? ALL_TURMOIL_CORPORATIONS.map((cf) => cf.cardName) : [],
                ...this.promoCardsOption ? ALL_PROMO_CORPORATIONS.map((cf) => cf.cardName) : []
            ],
            corporationGroups: [
                {"title": CorporationGroup.ORIGINAL, "items": ALL_CORPORATION_CARDS.concat(ALL_CORP_ERA_CORPORATION_CARDS).map((cf) => cf.cardName)},
                {"title": CorporationGroup.PRELUDE, "items": ALL_PRELUDE_CORPORATIONS.map((cf) => cf.cardName)},
                {"title": CorporationGroup.VENUS_NEXT, "items": ALL_VENUS_CORPORATIONS.map((cf) => cf.cardName)},
                {"title": CorporationGroup.COLONIES, "items": ALL_COLONIES_CORPORATIONS.map((cf) => cf.cardName)},
                {"title": CorporationGroup.TURMOIL, "items": ALL_TURMOIL_CORPORATIONS.map((cf) => cf.cardName)},
                {"title": CorporationGroup.PROMO, "items": ALL_PROMO_CORPORATIONS.map((cf) => cf.cardName)}
            ]
        }
    },
    methods: {
        getItemsByGroup: function (group: string): Array<CardName> {
            if (group === "All") return allItems.slice();

            const corps = this.corporationGroups.find((g) => g.title === group);
            if (corps === undefined) return [];
                        
            return (corps.items as any).slice()
        },
        selectAll: function (group: string) {
            const items = this.getItemsByGroup(group);
            for (const idx in items) {
                if ( ! this.selectedCorporations.includes(items[idx])) {
                    this.selectedCorporations.push(items[idx]);
                }
            }
        },
        removeFromSelecttion: function (cardName: CardName) {
            const itemIdx = this.selectedCorporations.indexOf(cardName)
            if (itemIdx !== -1) {
                this.selectedCorporations.splice(itemIdx, 1)
            }
        },
        selectNone: function (group: string) {
            const items = this.getItemsByGroup(group);
            for (const idx in items) {
                this.removeFromSelecttion(items[idx]);
            }
        },
        invertSelection: function (group: string) {
            const items = this.getItemsByGroup(group);

            for (const idx in items) {
                if (this.selectedCorporations.includes(items[idx])) {
                    this.removeFromSelecttion(items[idx]);
                } else {
                    this.selectedCorporations.push(items[idx]);
                }
            }
        }
    },
    watch: {
        selectedCorporations: function (value) {
            this.$emit("corporation-list-changed", value);
        },
        corporateEra: function (enabled) {
            enabled ? this.selectAll(CorporationGroup.ORIGINAL) : this.selectNone(CorporationGroup.ORIGINAL);
        },
        prelude: function (enabled) {
            enabled ? this.selectAll(CorporationGroup.PRELUDE) : this.selectNone(CorporationGroup.PRELUDE);
        },
        venusNext: function (enabled) {
            enabled ? this.selectAll(CorporationGroup.VENUS_NEXT) : this.selectNone(CorporationGroup.VENUS_NEXT);
        },
        colonies: function (enabled) {
            enabled ? this.selectAll(CorporationGroup.COLONIES) : this.selectNone(CorporationGroup.COLONIES);
        },
        turmoil: function (enabled) {
            enabled ? this.selectAll(CorporationGroup.TURMOIL) : this.selectNone(CorporationGroup.TURMOIL);
        },
        promoCardsOption: function (enabled) {
            enabled ? this.selectAll(CorporationGroup.PROMO) : this.selectNone(CorporationGroup.PROMO);
        }
    },
    template: `
    <div class="corporations-filter">
        <div class="corporations-filter-toolbox-cont">
            <h2>Corporations</h2>
            <div class="corporations-filter-toolbox corporations-filter-toolbox--topmost">
                <a href="#" v-on:click.prevent="selectAll('All')">All</a> | 
                <a href="#" v-on:click.prevent="selectNone('All')">None</a> | 
                <a href="#" v-on:click.prevent="invertSelection('All')">Invert</a>
            </div>
        </div>
        <div class="corporations-filter-group" v-for="group in corporationGroups">
            <div class="corporations-filter-toolbox-cont">
                <h2>{{ group.title }}</h2>
                <div class="corporations-filter-toolbox">
                    <a href="#" v-on:click.prevent="selectAll(group.title)">All</a> | 
                    <a href="#" v-on:click.prevent="selectNone(group.title)">None</a> | 
                    <a href="#" v-on:click.prevent="invertSelection(group.title)">Invert</a>
                </div>
            </div>
            <div v-for="corporation in group.items">
                <label class="form-checkbox">
                    <input type="checkbox" v-model="selectedCorporations" :value="corporation"/>
                    <i class="form-icon"></i>{{ corporation }}
                </label>    
            </div>
        </div>
    </div>
    `
});
