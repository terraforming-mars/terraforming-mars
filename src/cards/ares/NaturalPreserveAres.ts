import { CardName } from "../../CardName";
import { NaturalPreserve } from "../NaturalPreserve";
import { AdjacencyBonus } from "../../ares/AdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";

export class NaturalPreserveAres extends NaturalPreserve {
  public name: CardName = CardName.NATURAL_PRESERVE_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofAresSpaceBonus(1, AresSpaceBonus.MC);
}
