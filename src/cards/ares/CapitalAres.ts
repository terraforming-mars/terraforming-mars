import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {SpaceBonus} from '../../SpaceBonus';
import {CardName} from '../../CardName';
import {Capital} from '../base/Capital';

export class CapitalAres extends Capital {
  public name = CardName.CAPITAL_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]};
}
