
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";

export class SelectPlayer implements PlayerInput {
    constructor(public message: string, public players: Array<Player>, public title: string, public cb: (player: Player) => void) {

    }
}
