import {CardName} from './CardName';
import {COLONIES_CARD_MANIFEST} from './cards/colonies/ColoniesCardManifest';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {IProjectCard} from './cards/IProjectCard';
import {PRELUDE_CARD_MANIFEST} from './cards/prelude/PreludeCardManifest';
import {PROMO_CARD_MANIFEST} from './cards/promo/PromoCardManifest';
import {BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST} from './cards/StandardCardManifests';
import {TURMOIL_CARD_MANIFEST} from './cards/turmoil/TurmoilCardManifest';
import {VENUS_CARD_MANIFEST} from './cards/venusNext/VenusCardManifest';
import {COMMUNITY_CARD_MANIFEST} from './cards/community/CommunityCardManifest';
import {ISerializable} from './ISerializable';
import {SerializedDealer} from './SerializedDealer';
import {CardManifest} from './cards/CardManifest';
import {ICardFactory} from './cards/ICardFactory';
import {CardTypes, Deck} from './Deck';
import {GameModule} from './GameModule';
import {CardFinder} from './CardFinder';
import {ARES_CARD_MANIFEST} from './cards/ares/AresCardManifest';

export class Dealer implements ISerializable<SerializedDealer> {
    public deck: Array<IProjectCard> = [];
    public preludeDeck: Array<IProjectCard> = [];
    public discarded: Array<IProjectCard> = [];
    public corporationCards: Array<CorporationCard> = [];

    private constructor() { }

    public static newInstance(
      corporateEra: boolean,
      prelude: boolean,
      venusNext: boolean,
      colonies : boolean,
      promoCards: boolean,
      turmoil: boolean,
      ares: boolean,
      communityCards: boolean = false,
      cardsBlackList?: Array<CardName>,
    ): Dealer {
      const dealer = new Dealer();

      const deck:Array<IProjectCard> = [];
      const preludeDeck:Array<IProjectCard> = [];
      const projectCardsToRemove:Array<String> = [];
      const corporationCards: Array<CorporationCard> = [];

      function include(cf: ICardFactory<CardTypes>) : boolean {
        const expansion = cf.compatibility;
        switch (expansion) {
        case undefined:
          return true;
        case GameModule.Venus:
          return venusNext;
        case GameModule.Colonies:
          return colonies;
        case GameModule.Turmoil:
          return turmoil;
        default:
          throw ('Unhandled expansion type: ' + expansion);
        }
      }
      function addToDeck<T extends CardTypes>(deck: Array<T>, cards: Deck<T>): void {
        const cardInstances = cards.cards
          .filter((cf) => include(cf))
          .map((cf) => new cf.Factory());
        deck.push(...cardInstances);
      }
      function addToDecks(manifest: CardManifest) {
        addToDeck(deck, manifest.projectCards);
        addToDeck(corporationCards, manifest.corporationCards);
        addToDeck(preludeDeck, manifest.preludeCards);
        projectCardsToRemove.push(...manifest.projectCardsToRemove);
      }
      addToDecks(BASE_CARD_MANIFEST);
      if (corporateEra) {
        addToDecks(CORP_ERA_CARD_MANIFEST);
      }
      if (prelude) {
        addToDecks(PRELUDE_CARD_MANIFEST);
      }
      if (venusNext) {
        addToDecks(VENUS_CARD_MANIFEST);
      }
      if (colonies) {
        addToDecks(COLONIES_CARD_MANIFEST);
      }
      if (turmoil) {
        addToDecks(TURMOIL_CARD_MANIFEST);
      }
      if (ares) {
        addToDecks(ARES_CARD_MANIFEST);
      }
      if (promoCards) {
        addToDecks(PROMO_CARD_MANIFEST);
      }
      if (communityCards) {
        addToDecks(COMMUNITY_CARD_MANIFEST);
      }
      if (cardsBlackList) {
        projectCardsToRemove.push(...cardsBlackList);
      }
      const filteredDeck = deck.filter((card) => !projectCardsToRemove.includes(card.name));
      dealer.deck = dealer.shuffleCards(filteredDeck);
      if (prelude) {
        dealer.preludeDeck = dealer.shuffleCards(preludeDeck);
      }
      dealer.corporationCards = corporationCards;
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
