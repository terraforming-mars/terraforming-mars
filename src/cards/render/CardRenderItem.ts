/*
  Used to describe any distinct item on a card and prepare it for rendering in Vue
  e.g. Any tag, tile, production cube, ocean, temperature, etc.
 */
import {CardRenderItemType} from './CardRenderItemType';

export class CardRenderItem {
  public anyPlayer: boolean = false; // activated for any player
  public showDigit: boolean = false; // rendering a digit instead of chain of items
  public amountInside: boolean = false; // showing the amount for the item in its container
  public isPlayed: boolean = false; // used to mark an item as 'played' e.g. event tags
  constructor(public type: CardRenderItemType, public amount: number = -1) {
    if (Math.abs(this.amount) > 5) {
      this.showDigit = true;
    }
  }
}
