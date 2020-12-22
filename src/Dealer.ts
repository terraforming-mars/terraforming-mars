import {CardFinder} from './CardFinder';
import {CardName} from './CardName';
import {COLONIES_CARD_MANIFEST} from './cards/colonies/ColoniesCardManifest';
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
import {ARES_CARD_MANIFEST} from './cards/ares/AresCardManifest';

export class Dealer implements ISerializable<SerializedDealer> {
    public deck: Array<CardName> = [];
    public preludeDeck: Array<CardName> = [];
    public discarded: Array<CardName> = [];
    public corporationCards: Array<CardName> = [];

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
      const projectCardsToRemove: Array<CardName> = [];
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
      function addToDeck<T extends CardTypes>(deck: Array<CardName>, cards: Deck<T>): void {
        const cardInstances = cards.cards
          .filter((cf) => include(cf))
          .map((cf) => cf.cardName);
        deck.push(...cardInstances);
      }
      function addToDecks(manifest: CardManifest) {
        addToDeck(dealer.deck, manifest.projectCards);
        addToDeck(dealer.corporationCards, manifest.corporationCards);
        if (prelude) {
          addToDeck(dealer.preludeDeck, manifest.preludeCards);
        }
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
      const filteredDeck = dealer.deck.filter((card) => projectCardsToRemove.includes(card) === false);
      dealer.deck = dealer.shuffleCards(filteredDeck);
      dealer.preludeDeck = dealer.shuffleCards(dealer.preludeDeck);
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
      this.discarded.push(card.name);
    }
    public dealCard(isResearchPhase: boolean = false): IProjectCard {
      if (this.deck.length === 0) {
        this.deck = this.shuffleCards(this.discarded);
        this.discarded = [];
      }
      let result: CardName | undefined;
      if (isResearchPhase) {
        result = this.deck.shift();
      } else {
        result = this.deck.pop();
      }
      if (result === undefined) {
        throw 'Unexpected empty deck';
      }
      const card = CardFinder.getProjectCardByName(result);
      if (card === undefined) {
        throw 'Did not find card ' + result;
      }
      return card;
    }
    // Prelude deck does not need discard and reshuffle mecanisms
    public dealPreludeCard(): IProjectCard {
      const result = this.preludeDeck.pop();
      if (result === undefined) {
        throw 'Unexpected empty prelude deck';
      }
      const card = CardFinder.getProjectCardByName(result);
      if (card === undefined) {
        throw 'Did not find prelude card ' + result;
      }
      // All Prelude cards are expected to subclass IProjectCard
      return card;
    }

    public getDeckSize(): number {
      return this.deck.length;
    }

    public static deserialize(d: SerializedDealer): Dealer {
      const dealer = new Dealer();

      dealer.corporationCards = d.corporationCards;
      dealer.deck = d.deck;
      dealer.discarded = d.discarded;
      dealer.preludeDeck = d.preludeDeck;
      return dealer;
    }

    public serialize(): SerializedDealer {
      return {
        corporationCards: this.corporationCards,
        deck: this.deck,
        discarded: this.discarded,
        preludeDeck: this.preludeDeck,
      };
    }
}
