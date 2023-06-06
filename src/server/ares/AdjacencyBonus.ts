import {SpaceBonus} from '../../common/boards/SpaceBonus';

export type AdjacencyBonus = {
  bonus: Array<SpaceBonus | 'callback'>;
  cost ?: number;
  count ?: number;
  bonus2?: Array<SpaceBonus | 'callback'>;
  count2? :number
}
