import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';

export class Deck<T extends ICard> {
  constructor(public cards: Array<ICardFactory<T>>) {}

  public findByCardName(name: string): ICardFactory<T> | undefined {
    return this.cards.find((cf) => cf.cardName === name);
  }

  public shuffled(): Deck<T> {
    const shuffled: Array<ICardFactory<T>> = [];
    const copy = this.cards.slice();
    while (copy.length) {
      shuffled.push(
        copy.splice(Math.floor(Math.random() * copy.length), 1)[0],
      );
    }
    return new Deck(shuffled);
  }
}
