import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IProjectCard} from './cards/IProjectCard';
import {SerializedDealer} from './SerializedDealer';
import {CardFinder} from './CardFinder';
import {GameCards} from './GameCards';
import {CardName} from '../common/cards/CardName';
import {LogHelper} from './LogHelper';
import {Random, UnseededRandom} from './Random';
import {Logger} from './logs/Logger';
import {IPreludeCard} from './cards/prelude/IPreludeCard';

const INCOMPATIBLE_PRELUDES = [CardName.BY_ELECTION, CardName.THE_NEW_SPACE_RACE] as const;

export class Dealer {
  public deck: Array<IProjectCard> = [];
  public preludeDeck: Array<IPreludeCard> = [];
  public discarded: Array<IProjectCard> = [];
  public corporationCards: Array<ICorporationCard> = [];
  private random: Random;

  private constructor(random: Random) {
    this.random = random;
  }

  public static newInstance(gameCards: GameCards, random: Random = UnseededRandom.INSTANCE): Dealer {
    const dealer = new Dealer(random);

    dealer.deck = Dealer.shuffle(gameCards.getProjectCards(), random);
    dealer.corporationCards = gameCards.getCorporationCards();

    dealer.preludeDeck = Dealer.shuffle(gameCards.getPreludeCards(), random);
    // Special-case prelude deck: both The New Space Race and By-Election cannot
    // be used in the same game.
    const indexes = INCOMPATIBLE_PRELUDES.map((name) => dealer.preludeDeck.findIndex((c) => c.name === name));
    if (indexes[0] >= 0 && indexes[1] >= 0) {
      // Remove one from the game, randomly
      const target = random.nextInt(2);
      const indexToRemove = indexes[target];
      dealer.preludeDeck.splice(indexToRemove, 1);
    }
    return dealer;
  }

  public static shuffle<T>(cards: Array<T>, random: Random = UnseededRandom.INSTANCE): Array<T> {
    const deck: Array<T> = [];
    const copy = cards.slice();
    while (copy.length) {
      deck.push(copy.splice(random.nextInt(copy.length), 1)[0]);
    }
    return deck;
  }
  public discard(card: IProjectCard): void {
    this.discarded.push(card);
  }
  public dealCard(logger: Logger, isResearchPhase: boolean = false): IProjectCard {
    let result: IProjectCard | undefined;
    if (isResearchPhase) {
      result = this.deck.shift();
    } else {
      result = this.deck.pop();
    }

    if (result === undefined) {
      throw new Error('Unexpected empty deck');
    }

    if (this.deck.length === 0) {
      logger.log('The discard pile has been shuffled to form a new deck.');
      this.deck = Dealer.shuffle(this.discarded, this.random);
      this.discarded = [];
    }

    return result;
  }

  public drawProjectCardsByCondition(logger: Logger, total: number, include: (card: IProjectCard) => boolean) {
    const result: Array<IProjectCard> = [];
    const discardedCards = new Set<CardName>();

    while (result.length < total) {
      if (discardedCards.size >= this.getDeckSize() + this.getDiscardedSize()) {
        logger.log('discarded every card without match');
        break;
      }
      const projectCard = this.dealCard(logger);
      if (include(projectCard)) {
        result.push(projectCard);
      } else {
        discardedCards.add(projectCard.name);
        this.discard(projectCard);
      }
    }
    if (discardedCards.size > 0) {
      LogHelper.logDiscardedCards(logger, Array.from(discardedCards));
    }

    return result;
  }

  // Prelude deck does not need discard and reshuffle mecanisms
  public dealPreludeCard(): IProjectCard {
    const result: IProjectCard | undefined = this.preludeDeck.pop();
    if (result === undefined) {
      throw new Error('Unexpected empty prelude deck');
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
    // TODO(kberg): serializing the randomizer would help when using a seeded game that reshuffles.
    const dealer = new Dealer(UnseededRandom.INSTANCE);
    const cardFinder = new CardFinder();

    dealer.corporationCards = cardFinder.corporationCardsFromJSON(d.corporationCards);
    dealer.deck = cardFinder.cardsFromJSON(d.deck);
    dealer.discarded = cardFinder.cardsFromJSON(d.discarded);
    dealer.preludeDeck = cardFinder.preludesFromJSON(d.preludeDeck);
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
