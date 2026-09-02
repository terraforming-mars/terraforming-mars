import {ICardRenderItem} from './Types';

export type CardRenderDynamicVictoryPoints = {
  points: number;
  target: number;
  item?: ICardRenderItem;
  // marking target to be one or more res (Search for Life)
  targetOneOrMore?: boolean;
  // Law Suit
  anyPlayer?: boolean;
  // Show an asterisk
  asterisk?: boolean;
  asFraction?: boolean;
  vermin?: boolean;
}
