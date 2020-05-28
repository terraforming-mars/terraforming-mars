
import Vue, { VNode } from "vue";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { PlayerModel } from "../models/PlayerModel";
import { PlayerInputModel } from "../models/PlayerInputModel";

export class PlayerInputFactory {
    private getComponentName(inputType: PlayerInputTypes): string {
        switch (inputType) {
            case PlayerInputTypes.AND_OPTIONS:
                return "and-options";
            case PlayerInputTypes.SELECT_CARD:
                return "select-card";
            case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_CARD:
                return "select-how-to-pay-for-card";
            case PlayerInputTypes.OR_OPTIONS:
                return "or-options";
            case PlayerInputTypes.SELECT_OPTION:
                return "select-option";
            case PlayerInputTypes.SELECT_HOW_TO_PAY:
                return "select-how-to-pay";
            case PlayerInputTypes.SELECT_SPACE:
                return "select-space";
            case PlayerInputTypes.SELECT_PLAYER:
                return "select-player";
            case PlayerInputTypes.SELECT_AMOUNT:
                return "select-amount";
            case PlayerInputTypes.SELECT_PARTY:
                return "select-party";
            case PlayerInputTypes.SELECT_DELEGATE:
                return "select-party-player";
            default:
                throw "Unsupported input type";
        }
    }
    public getPlayerInput(createElement: typeof Vue.prototype.$createElement, players: Array<PlayerModel>, player: PlayerModel, playerinput: PlayerInputModel, onsave: (out: Array<Array<string>>) => void, showsave: boolean, showtitle: boolean): VNode {
        return createElement(this.getComponentName(playerinput.inputType), {
            attrs: {
                player, players, playerinput, showsave, showtitle, onsave
            }
        });
    }
}

