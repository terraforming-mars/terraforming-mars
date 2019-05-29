
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { SelectAmount } from "./SelectAmount";
import { SelectCard } from "./SelectCard";
import { IProjectCard } from "../cards/IProjectCard";
import { SelectPlayer } from "./SelectPlayer";
import { SelectOption } from "./SelectOption";
import { SelectHowToPay } from "./SelectHowToPay";

export class OrOptions implements PlayerInput {
    public cb(): undefined {
        return undefined;
    }
    public onend?: () => void; 
    public title: string = "Select one option";
    public options: Array<PlayerInput>;
    public inputType: PlayerInputTypes = PlayerInputTypes.OR_OPTIONS;
    constructor(
        ...options: Array<SelectAmount | SelectCard<IProjectCard> | SelectPlayer | SelectOption | SelectHowToPay>
    ) {
        this.options = options;
    }
}
