import {ICardRenderItem} from './Types';

export interface ICardRenderDynamicVictoryPoints {
  item: ICardRenderItem | undefined;
  points: number;
  target: number;
  item2?: ICardRenderItem | undefined;
  points2?: number;
  target2?: number;
  targetOneOrMore: boolean;
  anyPlayer: boolean;
}