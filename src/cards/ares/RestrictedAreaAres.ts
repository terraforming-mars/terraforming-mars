import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {RestrictedArea} from '../base/RestrictedArea';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';

export class RestrictedAreaAres extends RestrictedArea {
  public name = CardName.RESTRICTED_AREA_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.DRAW_CARD]};
}
