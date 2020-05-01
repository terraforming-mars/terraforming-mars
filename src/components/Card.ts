
import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { ALL_PRELUDE_CORPORATIONS,
         ALL_CORPORATION_CARDS,
         ALL_PROJECT_CARDS,
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


function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    let cardFactory = ALL_CORPORATION_CARDS.find((cardFactory) => cardFactory.cardName === cardName);
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

function getData(cardName: string, resources: string, wasPlayed: boolean): string | undefined {
    let htmlData : string | undefined = '';
    htmlData = HTML_DATA.get(cardName);
    if (htmlData !== undefined && (resources === undefined || resources === '0')) {
        htmlData = htmlData.replace('##RESOURCES##', '');
    }    
    if (htmlData !== undefined && resources !== undefined) {
        if (resources === '0') {
          htmlData = htmlData.replace('##RESOURCES##', '');
        } else {
          htmlData = htmlData.replace(
              '##RESOURCES##', 
              '<div class="card_resources_counter">RES:<span class="card_resources_counter--number">' + resources + '</span></div>');
        }
    }
    if (htmlData !== undefined && wasPlayed) {
      htmlData = '<div class="cards-action-was-used">'+htmlData+'</div>';
    }
    return htmlData;
}

export const Card = Vue.component("card", {
    props: [
        "card",
        "resources",
        "player"
    ],
    methods: {
        getData: function() {
            const wasPlayed = (this.player !== undefined && this.player.actionsThisGeneration !== undefined && this.player.actionsThisGeneration.indexOf(this.card) !== -1) ? true : false;
            return getData(this.card, this.resources, wasPlayed);
        },
        getCard: function () {
            return getProjectCardByName(this.card) || getCorporationCardByName(this.card);
        },
        cardNameToCssClass: function (cardName: string): string {
            return "filterDiv card-" + cardName.toLowerCase().replace(/ /g, "-");
        }
    },
    template: `
    <div :class="cardNameToCssClass(card)" v-i18n v-html=this.getData()></div>
    `
});
