import { CardName } from "../../CardName";
import { Capital } from "../Capital";
import { AdjacencyBonus, AresSpaceBonus } from "./AdjacencyBonus";

export class CapitalAres extends Capital {
  public name: CardName = CardName.CAPITAL_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofAresSpaceBonus(2, AresSpaceBonus.MC);
}
