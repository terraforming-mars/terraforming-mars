import { CardName } from "../../CardName";
import { SpaceBonus } from "../../SpaceBonus";
import { MoholeArea } from "../MoholeArea";
import { AdjacencyBonus } from "../../ares/AdjacencyBonus";

export class MoholeAreaAres extends MoholeArea {
  public name: CardName = CardName.MOHOLE_AREA_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofSpaceBonus(2, SpaceBonus.HEAT);
}
