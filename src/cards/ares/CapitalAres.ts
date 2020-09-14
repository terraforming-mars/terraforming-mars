import { CardName } from "../../CardName";
import { Capital } from "../Capital";
import { AdjacencyBonus } from "../../ares/AdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";

export class CapitalAres extends Capital {
  public name: CardName = CardName.CAPITAL_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofAresSpaceBonus(2, AresSpaceBonus.MC);
}
