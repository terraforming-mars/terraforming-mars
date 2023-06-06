import {SpaceBonus} from '../../common/boards/SpaceBonus';

export type AdjacencyRemove = {
  bonus: Array<SpaceBonus | 'callback'>;
  cost ?: number;
}
