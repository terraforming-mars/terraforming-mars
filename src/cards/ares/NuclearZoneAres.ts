import { IAdjacencyBonus } from "../../ares/IAdjacencyBonus";
import { CardName } from "../../CardName";
import { NuclearZone } from "../NuclearZone";

export class NuclearZoneAres extends NuclearZone {
  public cost: number = 11;
  public name: CardName = CardName.NUCLEAR_ZONE_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [], cost: 2};
}
