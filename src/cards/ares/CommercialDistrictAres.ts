import { CardName } from "../../CardName";
import { CommercialDistrict } from "../CommercialDistrict";
import { AdjacencyBonus } from "../../ares/AdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";

export class CommercialDistrictAres extends CommercialDistrict {
  public name: CardName = CardName.COMMERCIAL_DISTRICT_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofAresSpaceBonus(2, AresSpaceBonus.MC);
}
