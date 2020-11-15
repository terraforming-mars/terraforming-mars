import {SpaceBonus} from '../SpaceBonus';

export interface IAdjacencyBonus {
  bonus: Array<SpaceBonus>;
  cost ?: number;
}
