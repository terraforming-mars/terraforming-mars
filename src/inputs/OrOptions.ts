
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class OrOptions implements PlayerInput {
    public card?: IProjectCard;
    public cb(): undefined {
        return undefined;
    }
    public title: string = "Select one option";
    public options: Array<PlayerInput>;
    public inputType: PlayerInputTypes = PlayerInputTypes.OR_OPTIONS;
    constructor(
        ...options: Array<PlayerInput>
    ) {
        this.options = options;
    }
    public get message(): string {
        if (this.options.length) {
            return this.options[0].message;
        }
        return "";
    }
}
