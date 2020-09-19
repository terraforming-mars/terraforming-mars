import { SpaceBonus } from "../SpaceBonus";
import { AresSpaceBonus } from "./AresSpaceBonus";

export interface IAdjacencyBonus {
  bonus: Array<SpaceBonus | AresSpaceBonus>;
  cost ?: number;
}
