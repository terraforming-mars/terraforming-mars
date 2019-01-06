
import { SpaceBonus } from "./SpaceBonus";
import { SpaceType } from "./SpaceType";
import { ITile } from "./ITile";
import { Player } from "./Player";

export interface ISpace {
    id: string;
    spaceType: SpaceType;
    tile?: ITile;
    player?: Player;
    bonus?: Array<SpaceBonus>;
}
