
import Vue, { VNode } from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { ALL_CORPORATION_CARDS, ALL_PROJECT_CARDS } from "../Dealer";
import { Tags } from "../cards/Tags";
import { CardType } from "../cards/CardType";

interface SelectCardModel {
    cards: {[x: string]: number};
}

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    return ALL_CORPORATION_CARDS.find((card) => card.name === cardName);
}

function getProjectCardByName(cardName: string): IProjectCard | undefined {
    return ALL_PROJECT_CARDS.find((card) => card.name === cardName);
}

function getCardAsString(cardName: string): string {
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
    let card: Card | undefined = getProjectCardByName(cardName) || getCorporationCardByName(cardName);
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
    out += ">" + cardName + "</span>";
    if (card === undefined) {
        throw new Error("Did not find card");
    }
    if (card.cost !== undefined) {
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
    return out;
}

let unique: number = 0;

export const SelectCard = Vue.component("select-card", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            cards: {}
        } as SelectCardModel;
    },
    render: function (createElement) {
        unique++;
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title + " - " + this.playerinput.message));
        let inputType: string = "checkbox";
        if (this.playerinput.maxCardsToSelect === 1 && this.playerinput.minCardsToSelect === 1) {
            inputType = "radio";
        }
        this.playerinput.cards.forEach((card: any) => {
            children.push(
                createElement("label", { style: { display: "block", fontSize: "12px" }}, [
                    createElement("input", { domProps: { name: "selectCard" + unique, className: "nes-" + inputType, type: inputType, value: card.name }, on: { change: (event: any) => {
                        if (event.target.checked) {
                            this.cards[event.target.value] = 1;
                        } else {
                            delete this.cards[event.target.value];
                        }
                    }}}),
                    createElement("span", { domProps: { innerHTML: getCardAsString(card.name) }})
                ])
            )
        });
        children.push(
            createElement("button", { domProps: { className: "nes-btn" }, on: { click: () => {
                this.onsave([Object.keys(this.cards)]);
            } } }, "Save")
        );
        return createElement("div", children);
    }
});


