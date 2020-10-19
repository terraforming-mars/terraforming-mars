import { CardName } from "../../CardName";
import { EcologicalZone } from "../EcologicalZone";
import { IAdjacencyBonus } from "../../ares/IAdjacencyBonus";
import { SpaceBonus } from "../../SpaceBonus";

export class EcologicalZoneAres extends EcologicalZone {
  public cost: number = 11;
  public name: CardName = CardName.ECOLOGICAL_ZONE_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.ANIMAL]};
}
