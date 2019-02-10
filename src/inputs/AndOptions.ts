
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class AndOptions implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.AND_OPTIONS;
    public title: string = "Select all";
    public options: Array<PlayerInput>;
    public message: string;
    constructor(public cb: () => void, ...options: Array<PlayerInput>) {
        this.options = options;
        this.message = options[0].message;
    } 
}
