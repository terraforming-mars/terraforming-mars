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
import {StandardProjectCard} from './cards/standardProjects/StandardProjectCard';
import {GameOptions} from './Game';

export class Dealer implements ISerializable<SerializedDealer> {
    public deck: Array<IProjectCard> = [];
    public preludeDeck: Array<IProjectCard> = [];
    public discarded: Array<IProjectCard> = [];
    public corporationCards: Array<CorporationCard> = [];
    public standardProjects: Array<StandardProjectCard> = [];

    private constructor() { }

    public static newInstance(
      gameOptions: GameOptions,
      standardProjectsOnly = false,
    ): Dealer {
      const dealer = new Dealer();

      const deck:Array<IProjectCard> = [];
      const preludeDeck:Array<IProjectCard> = [];
      const projectCardsToRemove:Array<String> = [];
      const corporationCards: Array<CorporationCard> = [];
      const standardProjects: Array<StandardProjectCard> = [];

      function include(cf: ICardFactory<CardTypes>) : boolean {
        const expansion = cf.compatibility;
        switch (expansion) {
        case undefined:
          return true;
        case GameModule.Venus:
          return gameOptions.venusNextExtension;
        case GameModule.Colonies:
          return gameOptions.coloniesExtension;
        case GameModule.Turmoil:
          return gameOptions.turmoilExtension;
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
      function addToDecks(manifest: CardManifest, standardProjectsOnly = false) {
        addToDeck(standardProjects, manifest.standardProjects);
        if (standardProjectsOnly) return;
        addToDeck(deck, manifest.projectCards);
        addToDeck(corporationCards, manifest.corporationCards);
        addToDeck(preludeDeck, manifest.preludeCards);
        projectCardsToRemove.push(...manifest.projectCardsToRemove);
      }

      const manifests = [
        [true, BASE_CARD_MANIFEST],
        [gameOptions.corporateEra, CORP_ERA_CARD_MANIFEST],
        [gameOptions.preludeExtension, PRELUDE_CARD_MANIFEST],
        [gameOptions.venusNextExtension, VENUS_CARD_MANIFEST],
        [gameOptions.coloniesExtension, COLONIES_CARD_MANIFEST],
        [gameOptions.turmoilExtension, TURMOIL_CARD_MANIFEST],
        [gameOptions.aresExtension, ARES_CARD_MANIFEST],
        [gameOptions.promoCardsOption, PROMO_CARD_MANIFEST],
        [gameOptions.communityCardsOption, COMMUNITY_CARD_MANIFEST],
      ];
      for (const manifest of manifests) {
        if (manifest[0]) {
          addToDecks(<CardManifest>manifest[1], standardProjectsOnly);
        }
      }

      if (gameOptions.cardsBlackList) {
        projectCardsToRemove.push(...gameOptions.cardsBlackList);
      }
      const filteredDeck = deck.filter((card) => !projectCardsToRemove.includes(card.name));
      dealer.deck = dealer.shuffleCards(filteredDeck);
      if (gameOptions.preludeExtension) {
        dealer.preludeDeck = dealer.shuffleCards(preludeDeck);
      }
      dealer.corporationCards = corporationCards;
      dealer.standardProjects = standardProjects.sort((a, b) => a.cost - b.cost);
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

    public static deserialize(d: SerializedDealer, gameOptions: GameOptions): Dealer {
      const dealer = new Dealer();
      const cardFinder = new CardFinder();

      dealer.corporationCards = cardFinder.corporationCardsFromJSON(d.corporationCards);
      dealer.deck = cardFinder.cardsFromJSON(d.deck);
      dealer.discarded = cardFinder.cardsFromJSON(d.discarded);
      dealer.preludeDeck = cardFinder.cardsFromJSON(d.preludeDeck);
      dealer.standardProjects = this.newInstance(gameOptions, true).standardProjects;
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
