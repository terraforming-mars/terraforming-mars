import { CardName } from "../../CardName";
import { NaturalPreserve } from "../NaturalPreserve";
import { AdjacencyBonus, AresSpaceBonus } from "./AdjacencyBonus";

export class NaturalPreserveAres extends NaturalPreserve {
  public name: CardName = CardName.NATURAL_PRESERVE_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofAresSpaceBonus(1, AresSpaceBonus.MC);
}
