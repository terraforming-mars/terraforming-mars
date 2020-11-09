import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {IndustrialCenter} from '../IndustrialCenter';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';

export class IndustrialCenterAres extends IndustrialCenter {
  public name = CardName.INDUSTRIAL_CENTER_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.STEEL]};
}
