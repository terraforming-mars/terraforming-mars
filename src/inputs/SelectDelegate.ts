
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectDelegate implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_DELEGATE;
    constructor(public players: Array<Player | "NEUTRAL">, public title: string, public cb: (player: Player | "NEUTRAL") => PlayerInput | undefined) {

    }
}
