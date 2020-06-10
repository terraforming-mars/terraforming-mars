
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
import { CardType } from "../cards/CardType";
import { Expansion } from "../Expansion";

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

/**
 * This is the legacy getData() method which will be replaced by Card#get(Project|Corporation)CardHTML().
 * This method can be removed as soon as all cards are migrated to the new format. Until then it will be
 * called for all cards not yet migrated (graceful fallback), see Card#getData().
 */
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
        getProjectCardHTML: function (card: IProjectCard, cardResources: string, wasPlayed: boolean) {

            let html: string | undefined = ``;

            // Title
            if (card.cardType === CardType.EVENT) {
                html += `<div class="title background-color-events">${card.name}</div>`;
            } else if (card.cardType === CardType.ACTIVE) {
                html += `<div class="title background-color-active">${card.name}</div>`;
            } else if (card.cardType === CardType.AUTOMATED) {
                html += `<div class="title background-color-automated">${card.name}</div>`;
            } else {
                html += `<div class="title">${card.name}</div>`;
            }

            // Cost
            html += `<div class="price">${card.cost}</div>`;

            // Resources
            if (cardResources !== undefined && card.resourceType !== undefined) {
                html += `<div class="card_resources_counter">RES:<span class="card_resources_counter--number">${cardResources}</span></div>`;
            }

            // Tags
            for (let count = 1; count <= card.tags.length; count++) {
                html += `<div class="tag tag${count} tag-${card.tags[count-1]}"></div>`;
            }

            // Expansion
            switch (card.expansion) {
                case Expansion.CORPORATE_ERA:
                    html += `<div class="corporate-icon project-icon"></div>`
                    break;
            }

            // Card Number
            html += `<div class="card-number">${ String(card.cardNumber).padStart(3, '0')}</div>`;

            // Content
            html += `<div class="content">${card.content}</div>`;

            return (wasPlayed) ? `<div class="cards-action-was-used">${html}</div>` : html;
        },
        getData: function () {
            const wasPlayed = (this.player !== undefined && this.player.actionsThisGeneration !== undefined && this.player.actionsThisGeneration.indexOf(this.card) !== -1) ? true : false;
            let projectCard = getProjectCardByName(this.card);
            if (projectCard !== undefined && [CardType.ACTIVE, CardType.AUTOMATED, CardType.EVENT].includes(projectCard.cardType) && projectCard.content !== undefined) {
                return this.getProjectCardHTML(projectCard, this.resources, wasPlayed);
            }
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
