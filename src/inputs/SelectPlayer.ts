
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectPlayer implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_PLAYER;
    constructor(public players: Array<Player>, public title: string, public cb: (player: Player) => PlayerInput | undefined) {

    }
}
