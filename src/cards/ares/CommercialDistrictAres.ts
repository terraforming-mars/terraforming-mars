import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {SpaceBonus} from '../../SpaceBonus';
import {CardName} from '../../CardName';
import {CommercialDistrict} from '../CommercialDistrict';

export class CommercialDistrictAres extends CommercialDistrict {
  public name = CardName.COMMERCIAL_DISTRICT_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]};
}
