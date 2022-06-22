import {SpaceBonus} from '../common/boards/SpaceBonus';

export interface IAdjacencyBonus {
  bonus: Array<SpaceBonus>;
  cost ?: number;
}
