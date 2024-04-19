import {ICardRenderItem} from './Types';

export interface ICardRenderDynamicVictoryPoints {
  item: ICardRenderItem | undefined;
  points: number;
  target: number;
  targetOneOrMore: boolean;
  anyPlayer: boolean;
  asterisk: boolean | undefined;
  asFraction: boolean | undefined;
}
