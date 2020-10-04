import { IAdjacencyBonus } from "../../ares/IAdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";
import { CardName } from "../../CardName";
import { NaturalPreserve } from "../NaturalPreserve";

export class NaturalPreserveAres extends NaturalPreserve {
  public name: CardName = CardName.NATURAL_PRESERVE_ARES;
  public adjacencyBonus: IAdjacencyBonus =  {bonus: [AresSpaceBonus.MEGACREDITS]};
}
