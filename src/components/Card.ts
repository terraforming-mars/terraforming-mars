
import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { HTML_DATA } from "../HTML_data";
import { CardModel } from "../models/CardModel";
import { CardName } from "../CardName";
import { Decks } from "../Deck";
import { ALL_CORPORATION_DECKS, ALL_PRELUDE_DECKS, ALL_PROJECT_DECKS } from "../cards/AllCards";


function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    return Decks.findByName(ALL_CORPORATION_DECKS, cardName);
}

export function getProjectCardByName(cardName: string): IProjectCard | undefined {
    return Decks.findByName(ALL_PROJECT_DECKS.concat(ALL_PRELUDE_DECKS), cardName);
}

function getCardContent(cardName: string): string {
    let htmlData : string | undefined = '';
    htmlData = HTML_DATA.get(cardName);
    return htmlData || "";
}

export const Card = Vue.component("card", {
    props: [
        "card",
        "actionUsed"
    ],
    methods: {
        getCardContent: function() {
            return getCardContent(this.card.name);
        },
        getCard: function () {
            return getProjectCardByName(this.card.name) || getCorporationCardByName(this.card.name);
        },
        getCardCssClass: function (card: CardModel): string {
            var cssClass = "filterDiv card-" + card.name.toLowerCase().replace(/ /g, "-");
            if (this.actionUsed) {
                cssClass += " cards-action-was-used"
            }
            return cssClass;
        },
        lifeFound: function (card: CardModel): boolean {
            return card.name === CardName.SEARCH_FOR_LIFE && card.resources !== undefined && card.resources > 0
        }
    },
    template: `
    <div :class="getCardCssClass(card)">
        <img v-if="lifeFound(card)" class="little-green-men" src="assets/martian.png" />
        <div class="card_resources_counter" v-if="card.resources !== undefined">RES:<span class="card_resources_counter--number"> {{ card.resources }}</span></div>
        <div class="card-content-wrapper" v-i18n v-html=this.getCardContent()></div>
    </div>
    `
});
