
import Vue, { VNode } from "vue";

import { Tags } from "../cards/Tags";
import { CardType } from "../cards/CardType";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { HowToPay } from "../inputs/HowToPay";
import { ISpace } from "../ISpace";
import { ALL_CORPORATION_CARDS, ALL_PROJECT_CARDS } from "../Dealer";

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    return ALL_CORPORATION_CARDS.find((card) => card.name === cardName);
}

function getProjectCardByName(cardName: string): IProjectCard | undefined {
    return ALL_PROJECT_CARDS.find((card) => card.name === cardName);
}

const SelectSpace = Vue.component("select-space", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title));
        children.push(createElement("div", this.playerinput.message));
        const setOfSpaces: {[x: string]: number} = {};
        this.playerinput.availableSpaces.forEach((availableSpace: ISpace) => {
            setOfSpaces[availableSpace.id] = 1;
        });
        children.push(createElement("button", { on: { click: () => {
            const elTiles = document.getElementsByClassName("tile");
            for (let i = 0; i < elTiles.length; i++) {
                const elTile = elTiles[i] as HTMLElement;
                if (setOfSpaces[String(elTile.getAttribute("id"))] === 1) {
                    elTile.onmouseover = function () {
                        elTile.style.border = "1px solid black";
                        elTile.style.cursor = "pointer";
                    }
                    elTile.onmouseout = function () {
                        elTile.style.border = "0px solid black";
                        elTile.style.cursor = "default";
                    }
                    elTile.onclick = () => {
                        for (let j = 0; j < elTiles.length; j++) {
                            (elTiles[j] as HTMLElement).onmouseover = null;
                            (elTiles[j] as HTMLElement).onmouseout = null;
                            (elTiles[j] as HTMLElement).onclick = null;
                        }
                        this.onsave([[String(elTile.getAttribute("id"))]]);
                    }
                }
            }
        } } }, "Select Space"));
        return createElement("div", children);
    }
});

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

interface SelectCardModel {
    cards: {[x: string]: number};
}

const SelectCard = Vue.component("select-card", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            cards: {}
        } as SelectCardModel;
    },
    render: function (createElement) {
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title + " - " + this.playerinput.message));
        this.playerinput.cards.forEach((card: any) => {
            children.push(
                createElement("div", { style: { fontSize: "12px" }}, [
                    createElement("input", { domProps: { type: "checkbox", value: card.name }, on: { change: (event: any) => {
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
            createElement("button", { on: { click: () => {
                this.onsave([Object.keys(this.cards)]);
            } } }, "Save")
        );
        return createElement("div", children);
    }
});

const SelectHowToPay = Vue.component("select-how-to-pay", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title));
        let elSteelValue: HTMLInputElement | undefined = undefined;
        let elTitaniumValue: HTMLInputElement | undefined = undefined;
        let elHeatValue: HTMLInputElement | undefined = undefined;
        if (this.playerinput.canUseSteel) {
            children.push(createElement("label", "Steel: "));
            children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" } }));
            elSteelValue = (children[children.length - 1]!.elm as HTMLInputElement);
        }
        if (this.playerinput.canUseTitanium) {
            children.push(createElement("label", "Titanium: "));
            children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" } }));
            elTitaniumValue = (children[children.length - 1]!.elm as HTMLInputElement);
        }
        if (this.playerinput.canUseHeat) {
            children.push(createElement("label", "Heat: "));
            children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" } }));
            elHeatValue = (children[children.length - 1]!.elm as HTMLInputElement);
        }
        children.push(createElement("label", "Mega Credit: "));
        children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" } }));
        const elMegaValue = (children[children.length - 1]!.elm as HTMLInputElement);
        children.push(createElement("button", { on: { click: () => {
            const htp: HowToPay = {
                steel: 0,
                titanium: 0,
                megaCredits: 0,
                heat: 0
            };
            if (elSteelValue !== undefined) {
                htp.steel = parseInt(elSteelValue.value);
            }
            if (elTitaniumValue !== undefined) {
                htp.titanium = parseInt(elTitaniumValue.value);
            }
            if (elHeatValue !== undefined) {
                htp.heat = parseInt(elHeatValue.value);
            }
            if (elMegaValue !== undefined) {
                htp.megaCredits = parseInt(elMegaValue.value);
            }
            this.onsave([[JSON.stringify(htp)]]);
        } } }, "Save"));
        return createElement("div", children);
    }
});

const AndOptions = Vue.component("and-options", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            responded: {} as {[x: string]: Array<string>}
        };
    },
    render: function(createElement) {
        const children: Array<VNode> = [];
        const elMessage = createElement("div", this.playerinput.message);
        children.push(elMessage);
        this.playerinput.options.forEach((option: any, idx: number) => {
            if (this.responded[idx] === undefined) {
            children.push(getPlayerInput(createElement, option, (out: Array<Array<string>>) => {
                this.responded[idx] = out[0];
                if (Object.keys(this.responded).length === this.playerinput.options.length) {
                    let res: Array<Array<string>> = [];
                    for (let i = 0; i < this.playerinput.options.length; i++) {
                        res.push(this.responded["" + i]);
                    }
                    this.onsave(res);
                }
            }));
            }
        });
        return createElement("div", children);
    }
});

let unique: number = 0;

const OrOptions = Vue.component("or-options", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            selectedOption: 0
        };
    },
    render: function (createElement) {
        unique++;
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title));
        const optionElements: Array<VNode> = [];
        this.playerinput.options.forEach((option: any, idx: number) => {
            const subchildren: Array<VNode> = [];
            subchildren.push(createElement("input", { domProps: { name: "selectOption" + unique, type: "radio", value: String(idx) }, on: { change: (event: any) => {
                this.selectedOption = Number(event.target.value);
                optionElements.forEach((optionElement, optionIdx) => {
                    if (optionIdx === this.selectedOption) {
                        (optionElement.elm as HTMLElement).style.display = "block";
                    } else {
                        (optionElement.elm as HTMLElement).style.display = "none";
                    }
                });
            }}}));
            subchildren.push(createElement("span", option.message));
            subchildren.push(createElement("div", { style: { display: "none" } }, [getPlayerInput(createElement, option, (out: Array<Array<string>>) => {
                out.unshift([String(idx)]);
                this.onsave(out);
            })]));
            optionElements.push(subchildren[subchildren.length - 1]);
            children.push(createElement("div", subchildren));
        });
        return createElement("div", children);
    }
});

const SelectOption = Vue.component("select-option", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title));
        children.push(createElement("div", this.playerinput.message));
        children.push(createElement("button", { on: { click: () => { this.onsave([["1"]]); } } }, "Select"));
        return createElement("div", children);
    }
});

function getPlayerInput(createElement: typeof Vue.prototype.$createElement, playerInput: any, cb: (out: Array<Array<string>>) => void): VNode {
    if (playerInput.inputType === PlayerInputTypes.AND_OPTIONS) {
        return createElement("and-options", { attrs: { playerinput: playerInput, onsave: cb }});
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_CARD) {
        return createElement("select-card", { attrs: { playerinput: playerInput, onsave: cb }});
    } else if (playerInput.inputType === PlayerInputTypes.OR_OPTIONS) {
        return createElement("or-options", { attrs: { playerinput: playerInput, onsave: cb }});
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_OPTION) {
        return createElement("select-option", { attrs: { playerinput: playerInput, onsave: cb }});
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_HOW_TO_PAY) {
        return createElement("select-how-to-pay", { attrs: { playerinput: playerInput, onsave: cb }});
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_SPACE) {
        return createElement("select-space", { attrs: { playerinput: playerInput, onsave: cb }});
    }
    return createElement("div", "Unsupported input type" + playerInput.inputType);
}

export const WaitingFor = Vue.component("waiting-for", {
    props: ["waitingfor"],
    data: function () {
        return {}
    },
    components: {
        "and-options": AndOptions,
        "or-options": OrOptions,
        "select-card": SelectCard,
        "select-option": SelectOption,
        "select-how-to-pay": SelectHowToPay,
        "select-space": SelectSpace
    },
    render: function (createElement) {
        if (this.waitingfor === undefined) {
            return createElement("div", "Not your turn to take any actions");
        }
        return getPlayerInput(createElement, this.waitingfor, (out: Array<Array<string>>) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/player/input?id=" + (this.$parent as any).player.id);
            xhr.responseType = "json";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    (this.$root as any).$data.screen = "empty";
                    (this.$root as any).$data.player = xhr.response;
                    (this.$root as any).$data.screen = "player-home";
                } else {
                    alert("Error sending input");
                }
            }
            xhr.send(JSON.stringify(out));  
        });
    }
});

