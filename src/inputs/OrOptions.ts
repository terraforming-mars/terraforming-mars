
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class OrOptions implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectAmount";
    public card?: IProjectCard;
    public cb: () => void;
    public title: string = "Select one option";
    constructor(
        public ...options: Array<PlayerInput>
    ) {
        this.card = options[0].card;
        this.cb = function() {};
    } 
}
