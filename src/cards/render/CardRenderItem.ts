/*
  Used to describe any distinct item on a card and prepare it for rendering in Vue
  e.g. Any tag, tile, production cube, ocean, temperature, etc.
 */
import {CardRenderItemType} from './CardRenderItemType';
import {Size} from './Size';
import {Tags} from '../Tags';

// Tags that belong in `CardRenderItem.secondaryTag` that aren't part of `Tags`.
export enum AltSecondaryTag {
  // 'req' => used for Cutting Edge Technology's discount on cards with requirements
  REQ = 'req',
  // 'oxygen' => used for Greenery tile that increases oxygen on placement
  OXYGEN = 'oxygen',
  // 'turmoil' => used in Political Uprising community prelude
  TURMOIL = 'turmoil',
  FLOATER = 'floater',
  // 'blue' => used in Project Workshop
  BLUE = 'blue',

  MOON_MINING_RATE = 'moon-mine',
  MOON_COLONY_RATE = 'moon-colony',
  MOON_LOGISTICS_RATE = 'moon-road',
}

export interface ItemOptions {
  size?: Size;
  amount?: number;
  all?: boolean;
  digit?: true | false | 'large';
  played?: boolean;
  secondaryTag?: Tags | AltSecondaryTag;
  multiplier?: boolean; /** Mark any amount to be a multiplier 'X' */
  cancelled?: boolean;
  over?: number; /** Used for global events. */
}

export class CardRenderItem {
  // TODO (chosta): use child classes to describe special behavior
  public anyPlayer?: boolean; // activated for any player
  public showDigit?: boolean; // rendering a digit instead of chain of items
  public amountInside?: boolean; // showing the amount for the item in its container
  public isPlayed?: boolean; // used to mark an item as 'played' e.g. event tags
  public text?: string; // used text instead of integers in some cases
  public isUppercase?: boolean; // for uppercase text
  public isBold?: boolean; // for bold text
  public isPlate?: boolean; // used to mark plate a.k.a. text with golden background
  public size?: Size;
  // adding tag dependency (top right bubble)
  public secondaryTag?: Tags | AltSecondaryTag;
  // use this for amount labels like 2x, x, etc.
  public multiplier?: boolean = false;
  // add a symbol on top of the item to show it's cancelled or negated in some way (usually X)
  public cancelled?: boolean = false;
  // over is used for rendering under TR for global events.
  over?: number;
  // amount defaults to -1 meaning no digit is displayed but the CardRenderItem icon is shown
  constructor(public type: CardRenderItemType, public amount: number = -1, options?: ItemOptions) {
    switch (options?.digit) {
    case true:
      this.showDigit = true;
      break;
    case false:
      break; // it's undefined
    case 'large':
    default:
      this.showDigit = Math.abs(this.amount) > 5 ? true : undefined;
    }

    if (options === undefined) {
      return this;
    }
    this.size = options.size;
    if (options.amount !== undefined) {
      this.amount = options.amount;
    }
    this.anyPlayer = options.all;
    this.isPlayed = options.played;
    this.secondaryTag = options.secondaryTag;

    if (options.multiplier === true) {
      this.amountInside = true;
      this.multiplier = true;
    }

    this.cancelled = options.cancelled ?? false;
    this.over = options.over;

    return this;
  }
}
