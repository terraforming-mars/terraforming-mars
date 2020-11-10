import {CardName} from '../../CardName';
import {EcologicalZone} from '../EcologicalZone';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {SpaceBonus} from '../../SpaceBonus';

export class EcologicalZoneAres extends EcologicalZone {
  public cost = 11;
  public name = CardName.ECOLOGICAL_ZONE_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.ANIMAL]};
}
