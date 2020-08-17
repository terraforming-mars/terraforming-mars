
import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { ALL_PRELUDE_CORPORATIONS,
         ALL_CORPORATION_CARDS,
         ALL_CORP_ERA_CORPORATION_CARDS,
         ALL_PROJECT_CARDS,
         ALL_CORP_ERA_PROJECT_CARDS,
         ALL_PRELUDE_CARDS,
         ALL_PRELUDE_PROJECTS_CARDS,
         ALL_PROMO_CORPORATIONS,
         ALL_VENUS_CORPORATIONS,
         ALL_VENUS_PROJECTS_CARDS,
         ALL_COLONIES_PROJECTS_CARDS,
         ALL_TURMOIL_PROJECTS_CARDS,
         ALL_PROMO_PROJECTS_CARDS
         } from "../Dealer";
import { HTML_DATA } from "../HTML_data";
import { CardModel } from "../models/CardModel";
import { CardName } from "../CardName";


function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    let cardFactory = ALL_CORPORATION_CARDS.find((cardFactory) => cardFactory.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_CORP_ERA_CORPORATION_CARDS.find((cardFactory) => cardFactory.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PRELUDE_CORPORATIONS.find((cardFactory) => cardFactory.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_VENUS_CORPORATIONS.find((cardFactory) => cardFactory.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PROMO_CORPORATIONS.find((cardFactory) => cardFactory.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    return undefined;
}

export function getProjectCardByName(cardName: string): IProjectCard | undefined {
    let cardFactory = ALL_PRELUDE_CARDS.find((cardFactory) => cardFactory.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PRELUDE_PROJECTS_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_VENUS_PROJECTS_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_COLONIES_PROJECTS_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PROJECT_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_CORP_ERA_PROJECT_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_TURMOIL_PROJECTS_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PROMO_PROJECTS_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }    
    return undefined;
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
