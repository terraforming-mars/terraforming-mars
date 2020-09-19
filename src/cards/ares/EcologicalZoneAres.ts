import { CardName } from "../../CardName";
import { EcologicalZone } from "../EcologicalZone";
import { IAdjacencyBonus } from "../../ares/AdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";

export class EcologicalZoneAres extends EcologicalZone {
  public name: CardName = CardName.ECOLOGICAL_ZONE_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [AresSpaceBonus.ANIMAL]};
}
