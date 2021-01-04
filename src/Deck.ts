import {CardName} from './CardName';
import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';

export class Deck<T extends ICard> {
  public readonly factories: Map<CardName, ICardFactory<T>>;
  constructor(cards: Array<ICardFactory<T>>) {
    this.factories = new Map(cards.map((cf) => [cf.cardName, cf]));
  }

  public findByCardName(name: CardName): ICardFactory<T> | undefined {
    return this.factories.get(name);
  }
}
