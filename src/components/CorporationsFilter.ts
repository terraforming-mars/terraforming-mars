import Vue from "vue";

import { CardName } from "../CardName";
import { CorporationGroup } from "../CorporationName";
import { ALL_CORPORATION_DECKS } from "../cards/AllCards";
import { PRELUDE_CARD_MANIFEST } from "../cards/prelude/PreludeCardManifest";
import { VENUS_CARD_MANIFEST } from "../cards/venusNext/VenusCardManifest";
import { COLONIES_CARD_MANIFEST } from "../cards/colonies/ColoniesCardManifest";
import { CORP_ERA_CARD_MANIFEST, BASE_CARD_MANIFEST } from "../cards/StandardCardManifests";
import { PROMO_CARD_MANIFEST } from "../cards/promo/PromoCardManifest";
import { TURMOIL_CARD_MANIFEST } from "../cards/turmoil/TurmoilCardManifest";
import { CardManifest } from "../cards/CardManifest";
import { COMMUNITY_CARD_MANIFEST } from "../cards/community/CommunityCardManifest";


const allItems: Array<CardName> =
    ALL_CORPORATION_DECKS.map((deck) => deck.cards.map((cf) => cf.cardName))
        .reduce((accumulator, cards) => accumulator.concat(cards));

function corporateCardNames(cardManifest: CardManifest) : Array<CardName> {
    return cardManifest.corporationCards.cards.map((cf) => cf.cardName);
}

export const CorporationsFilter = Vue.component("corporations-filter", {
    props: ["corporateEra", "prelude", "venusNext", "colonies", "turmoil", "promoCardsOption", "communityCardsOption"],
    data: function () {
        const corpCardNames = {
            original: corporateCardNames(BASE_CARD_MANIFEST).concat(corporateCardNames(CORP_ERA_CARD_MANIFEST)),
            prelude:  corporateCardNames(PRELUDE_CARD_MANIFEST),
            venus: corporateCardNames(VENUS_CARD_MANIFEST),
            colonies: corporateCardNames(COLONIES_CARD_MANIFEST),
            turmoil: corporateCardNames(TURMOIL_CARD_MANIFEST),
            promo: corporateCardNames(PROMO_CARD_MANIFEST),
            community: corporateCardNames(COMMUNITY_CARD_MANIFEST),
        };
        return {
            customCorporationsList: false,
            selectedCorporations: [
                ...this.corporateEra ? corpCardNames.original : [],
                ...this.prelude ? corpCardNames.prelude : [],
                ...this.venusNext ? corpCardNames.venus : [],
                ...this.colonies ? corpCardNames.colonies : [],
                ...this.turmoil ? corpCardNames.turmoil : [],
                ...this.promoCardsOption ? corpCardNames.promo : [],
            ],
            corporationGroups: [
                {"title": CorporationGroup.ORIGINAL, "items": corpCardNames.original},
                {"title": CorporationGroup.PRELUDE, "items": corpCardNames.prelude},
                {"title": CorporationGroup.VENUS_NEXT, "items": corpCardNames.venus},
                {"title": CorporationGroup.COLONIES, "items": corpCardNames.colonies},
                {"title": CorporationGroup.TURMOIL, "items": corpCardNames.turmoil},
                {"title": CorporationGroup.PROMO, "items": corpCardNames.promo},
                {"title": CorporationGroup.COMMUNITY, "items": corpCardNames.community}
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
        },
        communityCardsOption: function (enabled) {
            enabled ? this.selectAll(CorporationGroup.COMMUNITY) : this.selectNone(CorporationGroup.COMMUNITY);
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
