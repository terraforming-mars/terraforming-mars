
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class OrOptions implements PlayerInput {
    public title: string = "Select one option";
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectAmount";
    public card?: IProjectCard;
    constructor(public option1: PlayerInput, public option2: PlayerInput) {
        this.card = option1.card;
    } 
}
