
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { SelectAmount } from "./SelectAmount";
import { SelectCard } from "./SelectCard";
import { SelectPlayer } from "./SelectPlayer";
import { SelectOption } from "./SelectOption";
import { SelectHowToPay } from "./SelectHowToPay";
import { ICard } from '../cards/ICard';
import { IProjectCard } from '../cards/IProjectCard';
import { SelectDelegate } from "./SelectDelegate";

export class OrOptions implements PlayerInput {
    public cb(): undefined {
        return undefined;
    }
    public title: string = "Select one option";
    public options: Array<PlayerInput>;
    public inputType: PlayerInputTypes = PlayerInputTypes.OR_OPTIONS;
    constructor(
        ...options: Array<SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard>| SelectPlayer | SelectOption | SelectHowToPay | SelectDelegate>
    ) {
        this.options = options;
    }
}
