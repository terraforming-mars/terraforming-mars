
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class DoNothing implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "DoNothing";
    constructor(public card: IProjectCard, public title: string = "Do nothing") {

    }
}
