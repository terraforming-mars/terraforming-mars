
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class BuyOrDiscard implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectACard";
    constructor(public card: IProjectCard, public cardCanBuy: IProjectCard) {

    }
}
