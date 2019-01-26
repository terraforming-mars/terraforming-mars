
import { PlayerInput } from "../PlayerInput";
import { IProjectCard } from "../cards/IProjectCard";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { Player } from "../Player";

export class SelectPlayer implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectAPlayer";
    constructor(public card: IProjectCard, public players: Array<Player>, public title: string = "Select a player") {

    }
}
