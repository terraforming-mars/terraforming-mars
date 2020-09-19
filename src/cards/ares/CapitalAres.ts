import { IAdjacencyBonus } from "../../ares/AdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";
import { CardName } from "../../CardName";
import { Capital } from "../Capital";

export class CapitalAres extends Capital {
  public name: CardName = CardName.CAPITAL_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [AresSpaceBonus.MEGACREDITS, AresSpaceBonus.MEGACREDITS]};
}
