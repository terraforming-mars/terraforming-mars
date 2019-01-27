
import { IProjectCard } from "../cards/IProjectCard";
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { ISpace } from "../ISpace";

export class SelectSpace implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectASpace";
    constructor(public card: IProjectCard | undefined, public title: string = "Select a space", public cb: (space: ISpace) => void) {

    }
}
