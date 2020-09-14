import { CardName } from "../../CardName";
import { EcologicalZone } from "../EcologicalZone";
import { AdjacencyBonus, AresSpaceBonus } from "../../ares/AdjacencyBonus";

export class EcologicalZoneAres extends EcologicalZone {
  public name: CardName = CardName.ECOLOGICAL_ZONE_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofAresSpaceBonus(1, AresSpaceBonus.ANIMAL);
}
