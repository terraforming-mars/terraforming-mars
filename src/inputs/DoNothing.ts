
import { PlayerInput } from "../PlayerInput";

export class DoNothing implements PlayerInput {
    constructor(public message: string, public title: string, public cb: () => void) {

    }
}
