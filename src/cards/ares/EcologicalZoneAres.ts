import { CardName } from "../../CardName";
import { EcologicalZone } from "../EcologicalZone";
import { AdjacencyBonus } from "../../ares/AdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";

export class EcologicalZoneAres extends EcologicalZone {
  public name: CardName = CardName.ECOLOGICAL_ZONE_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofAresSpaceBonus(1, AresSpaceBonus.ANIMAL);
}
