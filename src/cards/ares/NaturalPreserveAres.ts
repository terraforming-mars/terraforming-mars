import { IAdjacencyBonus } from "../../ares/IAdjacencyBonus";
import { SpaceBonus } from "../../SpaceBonus";
import { CardName } from "../../CardName";
import { NaturalPreserve } from "../NaturalPreserve";

export class NaturalPreserveAres extends NaturalPreserve {
  public name = CardName.NATURAL_PRESERVE_ARES;
  public adjacencyBonus: IAdjacencyBonus =  {bonus: [SpaceBonus.MEGACREDITS]};
}
