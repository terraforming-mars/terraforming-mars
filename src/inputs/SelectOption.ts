
import { PlayerInput } from "../PlayerInput";

export class SelectOption implements PlayerInput {
    constructor(public message: string, public title: string, public cb: (option: string) => void) {
    }
}

