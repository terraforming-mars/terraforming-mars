import {CardName} from './CardName';
import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';

const CARD_RENAMES = new Map<string, CardName>([
  // TODO(kberg): remove after 04/05/2021
  ['Earth Embasy', CardName.EARTH_EMBASSY],
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
