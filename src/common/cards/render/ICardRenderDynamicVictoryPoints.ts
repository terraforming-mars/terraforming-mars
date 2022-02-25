import {ICardRenderItem} from './Types';

export interface ICardRenderDynamicVictoryPoints {
  item: ICardRenderItem | undefined;
  points: number;
  target: number;
  targetOneOrMore: boolean;
  anyPlayer: boolean;
}
