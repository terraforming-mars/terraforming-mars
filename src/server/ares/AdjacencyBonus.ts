import {SpaceBonus} from '../../common/boards/SpaceBonus';

export type AdjacencyBonus = {
  bonus: Array<SpaceBonus | 'callback'>;
  cost ?: number;
}
