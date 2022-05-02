import {AltSecondaryTag} from './AltSecondaryTag';
import {Tags} from '../Tags';
import {TileType} from '../../TileType';
import {CardComponent} from './CardComponent';
import {CardRenderItemType} from './CardRenderItemType';
import {CardRenderSymbolType} from './CardRenderSymbolType';
import {Size} from './Size';

export interface ICardRenderRoot extends CardComponent {
  readonly is: 'root';
  rows: Array<Array<ItemType>>,
}
export interface ICardRenderSymbol extends CardComponent {
  type: CardRenderSymbolType;
  size: Size;
  isIcon: boolean;
  readonly is: 'symbol';
}

export function isICardRenderSymbol(item: ItemType): item is ICardRenderSymbol {
  return typeof(item) !== 'string' && item?.is === 'symbol';
}

export interface ICardRenderTile extends CardComponent {
  tile: TileType;
  hasSymbol: boolean;
  isAres: boolean;
  readonly is: 'tile';
}

export function isICardRenderTile(item: ItemType): item is ICardRenderTile {
  return typeof(item) !== 'string' && item?.is === 'tile';
}

export interface ICardRenderProductionBox extends CardComponent {
  readonly is: 'production-box';
  rows: Array<Array<ItemType>>,
}

export function isICardRenderProductionBox(item: ItemType): item is ICardRenderProductionBox {
  return typeof(item) !== 'string' && item?.is === 'production-box';
}

export interface ICardRenderEffect extends CardComponent {
  readonly is: 'effect';
  rows: Array<Array<ItemType>>,
}

export function isICardRenderEffect(item: ItemType): item is ICardRenderEffect {
  return typeof(item) !== 'string' && item?.is === 'effect';
}

export interface ICardRenderCorpBoxEffect extends CardComponent {
  readonly is: 'corp-box-effect';
  rows: Array<Array<ItemType>>,
}

export function isICardRenderCorpBoxEffect(item: ItemType): item is ICardRenderCorpBoxEffect {
  return typeof(item) !== 'string' && item?.is === 'corp-box-effect';
}

export interface ICardRenderCorpBoxAction extends CardComponent {
  readonly is: 'corp-box-action';
  rows: Array<Array<ItemType>>,
}

export function isICardRenderCorpBoxAction(item: ItemType): item is ICardRenderCorpBoxAction {
  return typeof(item) !== 'string' && item?.is === 'corp-box-action';
}

export interface ICardRenderItem extends CardComponent {
  readonly is: 'item';
  /** The thing being drawn */
  type: CardRenderItemType;
  /** The number of times it is drawn */
  amount: number;
  /** activated for any player */
  anyPlayer?: boolean;
  /** render a digit instead of chain of items */
  showDigit?: boolean;
  /** show the amount for the item in its container */
  amountInside?: boolean;
  /** used to mark an item as 'played' e.g. event tags */
  isPlayed?: boolean;
  /** used text instead of integers in some cases */
  text?: string;
  /** for uppercase text */
  isUppercase?: boolean;
  /** for bold text */
  isBold?: boolean;
  /** used to mark plate a.k.a. text with golden background */
  isPlate?: boolean;
  /** Size of the item. Very much depends on the CSS rendered for this item. */
  size?: Size;
  /** adding tag dependency (top right bubble of this item) */
  secondaryTag?: Tags | AltSecondaryTag;
  /** used for amount labels like 2x, x, etc. */
  multiplier?: boolean;
  /** add a symbol on top of the item to show it's cancelled or negated in some way (usually X) */
  cancelled?: boolean;
  /** over is used for rendering under TR for global events. */
  over?: number
;}

export function isICardRenderItem(item: ItemType): item is ICardRenderItem {
  return typeof(item) !== 'string' && item?.is === 'item';
}

export type ItemType = CardComponent | string | undefined;
