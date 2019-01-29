
import { PlayerInput } from "../PlayerInput";
import { ISpace } from "../ISpace";

export class SelectSpace implements PlayerInput {
    constructor(public title: string, public message: string, public cb: (space: ISpace) => void) {

    }
}
