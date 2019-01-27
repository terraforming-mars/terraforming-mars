
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class AndOptions implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectAmount";
    public title: string = "Select all";
    public card?: IProjectCard;
    constructor(public cb: () => void, public ...options: Array<PlayerInput>) {
        this.card = options[0].card;
    } 
}
