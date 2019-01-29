
import { PlayerInput } from "../PlayerInput";

export class SelectAmount implements PlayerInput {
    constructor(public message: string, public title: string, public cb: (amount: number) => void) {

    }
}
