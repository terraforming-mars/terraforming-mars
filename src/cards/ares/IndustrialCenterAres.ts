import { CardName } from "../../CardName";
import { SpaceBonus } from "../../SpaceBonus";
import { IndustrialCenter } from "../IndustrialCenter";
import { AdjacencyBonus } from "./AdjacencyBonus";

export class IndustrialCenterAres extends IndustrialCenter {
  public name: CardName = CardName.INDUSTRIAL_CENTER_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofSpaceBonus(2, SpaceBonus.STEEL);
}
