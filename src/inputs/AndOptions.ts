
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class AndOptions implements PlayerInput {
    public title: string = "Select all options";
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectAmount";
    public card: IProjectCard;
    constructor(public option1: PlayerInput, public option2: PlayerInput, public option3: PlayerInput) {
        this.card = option1.card;
    } 
}
