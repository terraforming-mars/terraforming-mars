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
import {liteBoolean} from '../../../common/LiteBoolean';

export type ItemOptions = Partial<{
  size: Size;
  amount: number;
  all: boolean;
  digit: boolean;
  played: boolean;
  secondaryTag: Tag | AltSecondaryTag;
  /** Replace the amount with the clone tag */
  clone: boolean;
  cancelled: true;
  /** Used for global events. */
  over: number;
  questionMark: boolean;
  text: string;
  superscript: boolean;
  resource: CardResource;
  tag: Tag;
}>

export class CardRenderItem implements ICardRenderItem {
  public readonly is = 'item';
  public anyPlayer?: boolean;
  public showDigit?: true;
  public amountInside?: true;
  public text?: string;
  public isUppercase?: true;
  public isBold?: true;
  public isPlate?: boolean;
  public size?: Size;
  public secondaryTag?: Tag | AltSecondaryTag;
  public clone?: boolean;
  public cancelled?: true;
  public innerText?: string;
  public isSuperscript?: true;
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
      this.showDigit = liteBoolean(Math.abs(this.amount) > 5);
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
      this.amountInside = undefined;
      this.clone = true;
    }

    this.cancelled = options.cancelled ? true : undefined;
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
