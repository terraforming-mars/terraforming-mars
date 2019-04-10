
import Vue, { VNode } from "vue";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { PlayerInputModel } from "../models/PlayerInputModel";

export class PlayerInputFactory {
    public  getPlayerInput(createElement: typeof Vue.prototype.$createElement, playerInput: PlayerInputModel, cb: (out: Array<Array<string>>) => void): VNode {
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
}

