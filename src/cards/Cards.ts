import {CardName} from '../CardName';
import {ICard} from './ICard';

export class Cards {
  private constructor() {}

  public static readonly toCardName: (card: ICard) => CardName = ((card: ICard) => card.name);
  public static byCardName(cardName: CardName): (card: ICard) => boolean {
    return ((card: ICard) => card.name === cardName);
  }
}
