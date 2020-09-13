import { CardName } from "../../CardName";
import { SpaceBonus } from "../../SpaceBonus";
import { RestrictedArea } from "../RestrictedArea";
import { AdjacencyBonus } from "./AdjacencyBonus";

export class RestrictedAreaAres extends RestrictedArea {
  public name: CardName = CardName.RESTRICTED_AREA_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofSpaceBonus(1, SpaceBonus.DRAW_CARD);
}
