import {ICardRenderItem} from './Types';

export interface ICardRenderDynamicVictoryPoints {
  item: ICardRenderItem | undefined;
  points: number;
  target: number;
  targetOneOrMore: boolean | undefined;
  anyPlayer: boolean | undefined;
  asterisk: boolean | undefined;
  asFraction: boolean | undefined;
  vermin: boolean | undefined;
}
