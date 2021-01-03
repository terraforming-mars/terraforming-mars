import {CorporationCard} from './cards/corporation/CorporationCard';
import {IProjectCard} from './cards/IProjectCard';
import {ISerializable} from './ISerializable';
import {SerializedDealer} from './SerializedDealer';
import {CardFinder} from './CardFinder';
import {CardLoader} from './CardLoader';

export class Dealer implements ISerializable<SerializedDealer> {
    public deck: Array<IProjectCard> = [];
    public preludeDeck: Array<IProjectCard> = [];
    public discarded: Array<IProjectCard> = [];
    public corporationCards: Array<CorporationCard> = [];

    private constructor() { }

    public static newInstance(loader: CardLoader): Dealer {
      const dealer = new Dealer();

      dealer.deck = dealer.shuffleCards(loader.getProjectCards());
      dealer.preludeDeck = dealer.shuffleCards(loader.getPreludeCards());
      dealer.corporationCards = loader.getCorporationCards();
      return dealer;
    }

    public shuffleCards<T>(cards: Array<T>): Array<T> {
      const deck: Array<T> = [];
      const copy = cards.slice();
      while (copy.length) {
        deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
      }
      return deck;
    }
    public discard(card: IProjectCard): void {
      this.discarded.push(card);
    }
    public dealCard(isResearchPhase: boolean = false): IProjectCard {
      let result: IProjectCard | undefined;
      if (isResearchPhase) {
        result = this.deck.shift();
      } else {
        result = this.deck.pop();
      }

      if (result === undefined) {
        throw 'Unexpected empty deck';
      }

      if (this.deck.length === 0) {
        this.deck = this.shuffleCards(this.discarded);
        this.discarded = [];
      }

      return result;
    }
    // Prelude deck does not need discard and reshuffle mecanisms
    public dealPreludeCard(): IProjectCard {
      const result: IProjectCard | undefined = this.preludeDeck.pop();
      if (result === undefined) {
        throw 'Unexpected empty prelude deck';
      }
      // All Prelude cards are expected to subclass IProjectCard
      return result;
    }

    public getDeckSize(): number {
      return this.deck.length;
    }

    public getDiscardedSize(): number {
      return this.discarded.length;
    }

    public static deserialize(d: SerializedDealer): Dealer {
      const dealer = new Dealer();
      const cardFinder = new CardFinder();

      dealer.corporationCards = cardFinder.corporationCardsFromJSON(d.corporationCards);
      dealer.deck = cardFinder.cardsFromJSON(d.deck);
      dealer.discarded = cardFinder.cardsFromJSON(d.discarded);
      dealer.preludeDeck = cardFinder.cardsFromJSON(d.preludeDeck);
      return dealer;
    }

    public serialize(): SerializedDealer {
      return {
        corporationCards: this.corporationCards.map((c) => c.name),
        deck: this.deck.map((c) => c.name),
        discarded: this.discarded.map((c) => c.name),
        preludeDeck: this.preludeDeck.map((c) => c.name),
      };
    }
}
