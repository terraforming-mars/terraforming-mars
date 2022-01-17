import {CardName} from './CardName';
import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';

const CARD_RENAMES = new Map<string, CardName>([
  // When renaming a card, add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in Deck.spec.ts.

  // TODO(yournamehere): remove after 2021-04-05
  // ['Earth Embasy', CardName.EARTH_EMBASSY],
]);

export class Deck<T extends ICard> {
  public readonly factories: Map<CardName, ICardFactory<T>>;
  constructor(cards: Array<ICardFactory<T>>) {
    this.factories = new Map(cards.map((cf) => [cf.cardName, cf]));
  }

  public findByCardName(name: CardName): ICardFactory<T> | undefined {
    const updatedName = CARD_RENAMES.get(name);
    if (updatedName !== undefined) {
      name = updatedName;
    }
    return this.factories.get(name);
  }
}
