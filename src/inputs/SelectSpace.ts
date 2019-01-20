
import { IProjectCard } from "../cards/IProjectCard";
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectSpace implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectASpace";
    constructor(public card: IProjectCard, public title: string = "Select a space") {

    }
}
