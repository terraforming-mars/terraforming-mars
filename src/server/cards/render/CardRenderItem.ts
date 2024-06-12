/*
  Describes any distinct item on a card and prepare it for rendering in Vue
  e.g. Any tag, tile, production cube, ocean, temperature, etc.
 */
import {CardRenderItemType} from '../../../common/cards/render/CardRenderItemType';
import {Size} from '../../../common/cards/render/Size';
import {Tag} from '../../../common/cards/Tag';
import {ICardRenderItem} from '../../../common/cards/render/Types';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {CardResource} from '../../../common/CardResource';

export type ItemOptions = Partial<{
  size: Size;
  amount: number;
  all: boolean;
  digit: boolean;
  played: boolean;
  secondaryTag: Tag | AltSecondaryTag;
  clone: boolean; /** Replace the amount with the clone tag */
  cancelled: boolean;
  over: number; /** Used for global events. */
  questionMark: boolean;
  text: string;
  superscript: boolean;
  resource: CardResource;
  tag: Tag;
}>

export class CardRenderItem implements ICardRenderItem {
  public readonly is = 'item';
  public anyPlayer?: boolean;
  public showDigit?: boolean;
  public amountInside?: boolean;
  public text?: string;
  public isUppercase?: boolean;
  public isBold?: boolean;
  public isPlate?: boolean;
  public size?: Size;
  public secondaryTag?: Tag | AltSecondaryTag;
  public clone?: boolean;
  public cancelled?: boolean;
  public innerText?: string;
  public isSuperscript?: boolean;
  public over?: number;
  public resource?: CardResource | undefined;
  public tag?: Tag | undefined;

  constructor(public type: CardRenderItemType, public amount: number = -1, options?: ItemOptions) {
    switch (options?.digit) {
    case true:
      this.showDigit = true;
      break;
    case false:
      break; // it's undefined
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
    this.secondaryTag = options.secondaryTag;

    if (options.clone === true) {
      this.amountInside = false;
      this.clone = true;
    }

    this.cancelled = options.cancelled ?? false;
    this.over = options.over;
    if (options.text !== undefined) {
      this.innerText = options.text;
    }
    if (options.superscript === true) {
      this.isSuperscript = true;
    }
    if (options.resource !== undefined) {
      this.resource = options.resource;
    }
    if (options.tag !== undefined) {
      this.tag = options.tag;
    }

    return this;
  }
}
