/*
  Used to describe any distinct item on a card and prepare it for rendering in Vue
  e.g. Any tag, tile, production cube, ocean, temperature, etc.
 */
import {CardRenderItemType} from './CardRenderItemType';
import {CardRenderItemSize} from './CardRenderItemSize';
import {Tags} from '../Tags';

export class CardRenderItem {
  // TODO (chosta): use child classes to describe special behavior
  public anyPlayer?: boolean; // activated for any player
  public showDigit?: boolean; // rendering a digit instead of chain of items
  public amountInside?: boolean; // showing the amount for the item in its container
  public isPlayed?: boolean; // used to mark an item as 'played' e.g. event tags
  public text?: string; // we can use text instead of integers in some cases
  public isUppercase?: boolean; // if we have text and it's uppercase
  public isPlate?: boolean; // used to mark plate a.k.a. text with golden background
  public size?: CardRenderItemSize;
  // adding tag dependency (top right bubble)
  // 'req' => used for Cutting Edge Technology's discount on cards with requirements
  // 'oxygen' => used for Greenery tile that increases oxygen on placement
  // TODO (chosta): if we have more than two (lol) non Tags secondary tag, add an enum
  public secondaryTag?: Tags | 'req' | 'oxygen';
  // use this for amount labels like 2x, x, etc.
  public multiplier?: boolean = false;
  constructor(public type: CardRenderItemType, public amount: number = -1) {
    if (Math.abs(this.amount) > 5) {
      this.showDigit = true;
    }
  }
}
