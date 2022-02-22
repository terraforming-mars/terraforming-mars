import {CardRenderItem} from './CardRenderItem';

export interface ICardRenderDynamicVictoryPoints {
  item: CardRenderItem | undefined;
  points: number;
  target: number;
  targetOneOrMore: boolean;
  anyPlayer: boolean;
}
