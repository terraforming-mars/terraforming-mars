import {CardName} from './CardName';
import {ICardFactory} from './cards/ICardFactory';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {IProjectCard} from './cards/IProjectCard';
import {PreludeCard} from './cards/prelude/PreludeCard';
import {StandardProjectCard} from './cards/standardProjects/StandardProjectCard';

export type CardTypes = IProjectCard | CorporationCard | PreludeCard | StandardProjectCard;

export class Deck<T extends CardTypes> {
    cards: Array<ICardFactory<T>>;

    constructor(cards: Array<ICardFactory<T>>) {
      this.cards = cards;
    }

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

export class Decks {
  public static findByName<T extends CardTypes>(decks: Array<Deck<T>>, cardName: string): T | undefined {
    let found: T | undefined;

    decks.forEach((deck) => {
      // Short circuit
      if (found) {
        return;
      }
      const cf = deck.findByCardName(cardName);
      if (cf) {
        found = cf.factory();
      }
    });
    return found;
  }

  public static allCardNames(decks: Array<Deck<CardTypes>>): Array<CardName> {
    const arrays: Array<Array<CardName>> = decks.map((deck) => deck.cards.map((cf) => cf.cardName));
    return ([] as Array<CardName>).concat(...arrays);
  }
}
