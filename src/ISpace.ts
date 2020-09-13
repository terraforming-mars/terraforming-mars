
import { SpaceBonus } from "./SpaceBonus";
import { SpaceType } from "./SpaceType";
import { ITile } from "./ITile";
import { Player } from "./Player";
import { IAdjacencyBonus } from "./cards/ares/IAdjacenyBonus";

export interface ISpace {
    id: string;
    spaceType: SpaceType;
    tile?: ITile;
    player?: Player;
    bonus: Array<SpaceBonus>;
    adjacency?: {
        bonus ?: IAdjacencyBonus,
        cost ?: number,
    }
    x: number;
    y: number;
}
