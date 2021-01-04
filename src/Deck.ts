import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';

export class Deck<T extends ICard> {
  constructor(public cards: Array<ICardFactory<T>>) {}

  public findByCardName(name: string): ICardFactory<T> | undefined {
    return this.cards.find((cf) => cf.cardName === name);
  }
}
