
import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { ALL_CORPORATION_CARDS, ALL_PROJECT_CARDS } from "../Dealer";
import { Tags } from "../cards/Tags";
import { CardType } from "../cards/CardType";

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    return ALL_CORPORATION_CARDS.find((card) => card.name === cardName);
}

function getProjectCardByName(cardName: string): IProjectCard | undefined {
    return ALL_PROJECT_CARDS.find((card) => card.name === cardName);
}

export const Card = Vue.component("card", {
    props: [
        "animals",
        "card",
        "fighterResources",
        "microbes",
        "hideCost",
        "scienceResources"
    ],
    data: function () {
        return {};
    },
    render: function (createElement) {
        interface Card {
            cost?: number;
            startingMegaCredits?: number;
            name: string;
            tags: Array<Tags>;
            text: string;
            cardType?: CardType;
            description: string;
            actionText?: string;
        }
        let card: Card | undefined = getProjectCardByName(this.card) || getCorporationCardByName(this.card);
        if (card === undefined) {
            throw new Error("Card not found");
        }
        let out = "<span";
        if (card.cardType === CardType.EVENT) {
            out += " style='font-weight:bold;color:red'";
        } else if (card.cardType === CardType.ACTIVE) {
            out += " style='font-weight:bold;color:blue'";
        } else if (card.cardType === CardType.AUTOMATED) {
            out += " style='font-weight:bold;color:green'";
        } else {
            out += " style='font-weight:bold'";
        }
        out += ">" + this.card + "</span>";
        if (card === undefined) {
            throw new Error("Did not find card");
        }
        if (this.hideCost !== "true" && card.cost !== undefined) {
            out += " Costs " + String(card.cost) + ".";
        }
        if (card.startingMegaCredits !== undefined) {
            out += " Start with " + String(card.startingMegaCredits) + " mega credits.";
        }
        if (card.tags.length === 1) {
            out += " Has " + card.tags[0] + " tag.";
        } else if (card.tags.length > 1) {
            out += " Has ";
            let i = 0;
            for (; i < card.tags.length - 1; i++) {
                out += card.tags[i] + ", ";
            }
            out += "and " + card.tags[i] + " tags.";
        }
        if (card.actionText) {
            out += " <b>" + card.actionText + "</b>";
        }
        out += " " + card.text;
        out += " <i>" + card.description + "</i>";
        if (this.animals !== undefined) {
            out += "<strong>" + this.animals + " animals on card</strong>";
        } else if (this.fighterResources !== undefined) {
            out += "<strong>" + this.fighterResources + " fighter resources on card</strong>";
        } else if (this.microbes !== undefined) {
            out += "<strong>" + this.microbes + " microbes on card</strong>";
        } else if (this.scienceResources !== undefined) {
            out += "<strong>" + this.scienceResources + " science resources on card</strong>";
        }
        return createElement("span", { domProps: { innerHTML: out } });
    }
});

