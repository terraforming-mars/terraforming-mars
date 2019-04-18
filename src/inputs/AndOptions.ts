
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class AndOptions implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.AND_OPTIONS;
    public onend?: () => void;
    public title: string = "Select all";
    public options: Array<PlayerInput>;
    public message: string = "";
    constructor(public cb: () => PlayerInput | undefined, ...options: Array<PlayerInput>) {
        this.options = options;
        if (options.length > 0) {
            this.message = options[0].message;
        }
    } 
}
