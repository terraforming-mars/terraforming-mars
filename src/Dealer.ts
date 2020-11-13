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
import {ILoadable} from './ILoadable';
import {SerializedDealer} from './SerializedDealer';
import {CardManifest} from './cards/CardManifest';
import {ICardFactory} from './cards/ICardFactory';
import {CardTypes, Deck} from './Deck';
import {GameModule} from './GameModule';
import {CardFinder} from './CardFinder';
import {ARES_CARD_MANIFEST} from './cards/ares/AresCardManifest';

export class Dealer implements ILoadable<SerializedDealer, Dealer> {
    public deck: Array<IProjectCard> = [];
    public preludeDeck: Array<IProjectCard> = [];
    public discarded: Array<IProjectCard> = [];
    public corporationCards: Array<CorporationCard> = [];
    private useCorporateEra: boolean = true;
    private usePreludeExtension: boolean = false;
    private useVenusNextExtension: boolean = false;
    private useColoniesNextExtension: boolean = false;
    private usePromoCards: boolean = false;
    private useTurmoilExtension: boolean = false;
    private useAresExtension: boolean = false;

    constructor(
        useCorporateEra: boolean,
        usePreludeExtension: boolean,
        useVenusNextExtension: boolean,
        useColoniesNextExtension : boolean,
        usePromoCards: boolean,
        useTurmoilExtension: boolean,
        useAresExtension: boolean,
        useCommunityCards: boolean = false,
        cardsBlackList?: Array<CardName>,
    ) {
      this.useCorporateEra = useCorporateEra;
      this.usePreludeExtension = usePreludeExtension;
      this.useVenusNextExtension = useVenusNextExtension;
      this.useColoniesNextExtension = useColoniesNextExtension;
      this.usePromoCards = usePromoCards;
      this.useTurmoilExtension = useTurmoilExtension;
      this.useAresExtension = useAresExtension;

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
            return useVenusNextExtension;
          case GameModule.Colonies:
            return useColoniesNextExtension;
          case GameModule.Turmoil:
            return useTurmoilExtension;
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
      if (this.useCorporateEra) {
        addToDecks(CORP_ERA_CARD_MANIFEST);
      }
      if (this.usePreludeExtension) {
        addToDecks(PRELUDE_CARD_MANIFEST);
      }
      if (this.useVenusNextExtension) {
        addToDecks(VENUS_CARD_MANIFEST);
      }
      if (this.useColoniesNextExtension) {
        addToDecks(COLONIES_CARD_MANIFEST);
      }
      if (this.useTurmoilExtension) {
        addToDecks(TURMOIL_CARD_MANIFEST);
      }
      if (this.useAresExtension) {
        addToDecks(ARES_CARD_MANIFEST);
      }
      if (this.usePromoCards) {
        addToDecks(PROMO_CARD_MANIFEST);
      }
      if (useCommunityCards) {
        addToDecks(COMMUNITY_CARD_MANIFEST);
      }
      if (cardsBlackList) {
        projectCardsToRemove.push(...cardsBlackList);
      }
      const filteredDeck = deck.filter((card) => !projectCardsToRemove.includes(card.name));
      this.deck = this.shuffleCards(filteredDeck);
      if (this.usePreludeExtension) {
        this.preludeDeck = this.shuffleCards(preludeDeck);
      }
      this.corporationCards = corporationCards;
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
      if (this.deck.length === 0) {
        this.deck = this.shuffleCards(this.discarded);
        this.discarded = [];
      }
      let result: IProjectCard | undefined;
      if (isResearchPhase) {
        result = this.deck.shift();
      } else {
        result = this.deck.pop();
      }

      if (result === undefined) {
        throw 'Unexpected empty deck';
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

    public loadFromJSON(d: SerializedDealer): Dealer {
      const cardFinder = new CardFinder();

      this.corporationCards = cardFinder.corporationCardsFromJSON(d.corporationCards);
      this.deck = cardFinder.cardsFromJSON(d.deck);
      this.discarded = cardFinder.cardsFromJSON(d.discarded);
      this.preludeDeck = cardFinder.cardsFromJSON(d.preludeDeck);
      this.useAresExtension = d.useAresExtension;
      this.useColoniesNextExtension = d.useColoniesNextExtension;
      this.useCorporateEra = d.useCorporateEra;
      this.usePreludeExtension = d.usePreludeExtension;
      this.usePromoCards = d.usePromoCards;
      this.useTurmoilExtension = d.useTurmoilExtension;
      this.useVenusNextExtension = d.useVenusNextExtension;
      return this;
    }

    public getDeckSize(): number {
      return this.deck.length;
    }

    public serialize(): SerializedDealer {
      return {
        corporationCards: this.corporationCards.map((c) => c.name),
        deck: this.deck.map((c) => c.name),
        discarded: this.discarded.map((c) => c.name),
        preludeDeck: this.preludeDeck.map((c) => c.name),
        useAresExtension: this.useAresExtension,
        useColoniesNextExtension: this.useColoniesNextExtension,
        useCorporateEra: this.useCorporateEra,
        usePreludeExtension: this.usePreludeExtension,
        usePromoCards: this.usePromoCards,
        useVenusNextExtension: this.useVenusNextExtension,
        useTurmoilExtension: this.useTurmoilExtension,
      };
    }
}
