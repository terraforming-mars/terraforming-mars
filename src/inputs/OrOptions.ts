
import { PlayerInput } from "../PlayerInput";
import { IProjectCard } from "../cards/IProjectCard";

export class OrOptions implements PlayerInput {
    public card?: IProjectCard;
    public cb: () => void;
    public title: string = "Select one option";
    public options: Array<PlayerInput>;
    constructor(
        ...options: Array<PlayerInput>
    ) {
        this.options = options;
        this.cb = function() {};
    } 
    public get message(): string {
        if (this.options.length) {
            return this.options[0].message;
        }
        return "";
    }
}
