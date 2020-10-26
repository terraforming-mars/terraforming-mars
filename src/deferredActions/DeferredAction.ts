import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";

export interface DeferredAction {
    player: Player,
    execute: () => PlayerInput | undefined
}
