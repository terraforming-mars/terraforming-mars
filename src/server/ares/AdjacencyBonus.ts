import {SpaceBonus} from '../../common/boards/SpaceBonus';

export type AdjacencyBonus = {
  bonus: Array<SpaceBonus | 'callback'>;
  // Additional placement costs (specifically Nuclear Zone)
  cost ?: number;
}
