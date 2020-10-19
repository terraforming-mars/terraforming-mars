import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { DeferredAction } from "./DeferredAction";

export class SimpleDeferredAction implements DeferredAction {
    constructor(
        public player: Player,
        public execute: () => PlayerInput | undefined
    ){}
}
