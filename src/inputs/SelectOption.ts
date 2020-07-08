import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { SelectSpace } from "./SelectSpace";
import { SelectHowToPay } from './SelectHowToPay';
import { AndOptions } from './AndOptions';
import { SelectAmount } from "./SelectAmount";
import { SelectCard } from "./SelectCard";
import { ICard } from "../cards/ICard";

export class SelectOption implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_OPTION;
    constructor(public title: string, public cb: () => SelectSpace | SelectHowToPay | AndOptions | SelectOption | SelectAmount | SelectCard<ICard> | undefined) {
    }
}

