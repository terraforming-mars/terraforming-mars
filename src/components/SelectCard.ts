
import Vue, { VNode } from "vue";

interface SelectCardModel {
    cards: {[x: string]: number};
}

import { PlayerInputModel } from "../models/PlayerInputModel";

let unique: number = 0;

export const SelectCard = Vue.component("select-card", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            cards: {}
        } as SelectCardModel;
    },
    render: function (createElement) {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        unique++;
        const children: Array<VNode> = [];
        children.push(createElement("div", playerInput.title + " - " + playerInput.message));
        let inputType: string = "checkbox";
        if (playerInput.maxCardsToSelect === 1 && playerInput.minCardsToSelect === 1) {
            inputType = "radio";
        }
        if (playerInput.cards !== undefined) {
            playerInput.cards.forEach((card) => {
                children.push(
                    createElement("label", { style: { display: "block", fontSize: "12px" }}, [
                        createElement("input", { domProps: { name: "selectCard" + unique, className: "nes-" + inputType, type: inputType, value: card }, on: { change: (event: any) => {
                            if (event.target.checked) {
                                this.cards[event.target.value] = 1;
                            } else {
                                delete this.cards[event.target.value];
                            }
                        }}}),
                        createElement("card", { attrs: { card: card }})
                    ])
                );
            });
        }
        children.push(
            createElement("button", { domProps: { className: "nes-btn" }, on: { click: () => {
                this.onsave([Object.keys(this.cards)]);
            } } }, "Save")
        );
        return createElement("div", children);
    }
});


