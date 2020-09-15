
import { SpaceBonus } from "./SpaceBonus";
import { SpaceType } from "./SpaceType";
import { ITile } from "./ITile";
import { Player } from "./Player";
import { AdjacencyBonus } from "./ares/AdjacencyBonus";

export interface ISpace {
    id: string;
    spaceType: SpaceType;
    tile?: ITile;
    player?: Player;
    bonus: Array<SpaceBonus>;
    adjacency?: {
        bonus ?: AdjacencyBonus,
        cost ?: number,
    }
    x: number;
    y: number;
}
