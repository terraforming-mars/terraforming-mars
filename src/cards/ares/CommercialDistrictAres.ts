import { IAdjacencyBonus } from "../../ares/IAdjacencyBonus";
import { AresSpaceBonus } from "../../ares/AresSpaceBonus";
import { CardName } from "../../CardName";
import { CommercialDistrict } from "../CommercialDistrict";

export class CommercialDistrictAres extends CommercialDistrict {
  public name: CardName = CardName.COMMERCIAL_DISTRICT_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [AresSpaceBonus.MEGACREDITS, AresSpaceBonus.MEGACREDITS]};
}
