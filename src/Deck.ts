import {CardName} from './CardName';
import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';

const CARD_RENAMES = new Map<string, CardName>([
  // TODO(bafolts): remove after 02/15/2021 before 03/01/2021
  ['CEOs Favorite Project', CardName.CEOS_FAVORITE_PROJECT],
  // TODO(bafolts): remove after 02/15/2021 before 03/01/2021
  ['Rad-chem Factory', CardName.RAD_CHEM_FACTORY],
  // TODO(bafolts): remove after 02/15/2021 before 03/01/2021
  ['Titan Floater Launch-pad', CardName.TITAN_FLOATING_LAUNCHPAD],
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
