import {SerializedDeck} from './SerializedDeck';
import {CardFinder} from '../CardFinder';
import {CardName} from '../../common/cards/CardName';
import {LogHelper} from '../LogHelper';
import {Random} from '../../common/utils/Random';
import {ICard} from './ICard';
import {ICorporationCard} from './corporation/ICorporationCard';
import {IProjectCard} from './IProjectCard';
import {inplaceShuffle} from '../utils/shuffle';
import {Logger} from '../logs/Logger';
import {IPreludeCard} from './prelude/IPreludeCard';
import {ICeoCard} from './ceos/ICeoCard';

/**
 * A deck of cards to draw from, and also its discard pile.
 */
export class Deck<T extends ICard> {
  private readonly type;
  public drawPile: Array<T>;
  public discardPile: Array<T>;
  private readonly random: Random;

  // Exposing shuffle so it can be replaced in tests.
  public static shuffle(array: Array<any>, random: Random) {
    inplaceShuffle(array, random);
  }

  protected constructor(type: string, drawPile: Array<T>, discards: Array<T>, random: Random) {
    this.type = type;
    this.drawPile = drawPile;
    this.discardPile = discards;
    this.random = random;
  }

  public shuffle(cardsOnTop: Array<CardName> = []) {
    const copy = [...this.drawPile, ...this.discardPile];
    this.drawPile.splice(0, this.drawPile.length);
    this.discardPile.splice(0, this.discardPile.length);

    if (cardsOnTop.length === 0) {
      Deck.shuffle(copy, this.random);
      this.drawPile.push(...copy);
    } else {
      const set = new Set(cardsOnTop);
      const top: Array<T> = [];
      const rest: Array<T> = [];
      copy.forEach((card) => {
        if (set.has(card.name)) {
          top.push(card);
        } else {
          rest.push(card);
        }
      });
      inplaceShuffle(top, this.random);
      inplaceShuffle(rest, this.random);
      this.drawPile.push(...rest, ...top);
    }
  }

  public draw(logger: Logger, source: 'top' | 'bottom' = 'top'): T | undefined {
    if (this.drawPile.length === 0) {
      logger.log(`The ${this.type} discard pile has been shuffled to form a new deck.`);
      this.shuffle();
    }

    const card = source === 'top' ? this.drawPile.pop() : this.drawPile.shift();

    if (this.drawPile.length === 0) {
      logger.log(`The ${this.type} discard pile has been shuffled to form a new deck.`);
      this.shuffle();
    }

    return card;
  }

  public drawLegacy(logger: Logger, source: 'top' | 'bottom' = 'top'): T {
    return this.drawOrThrow(logger, source);
  }

  public drawOrThrow(logger: Logger, source: 'top' | 'bottom' = 'top'): T {
    const card = source === 'top' ? this.drawPile.pop() : this.drawPile.shift();

    if (card === undefined) {
      throw new Error(`Unexpected empty ${this.type} deck`);
    }

    if (this.drawPile.length === 0) {
      logger.log(`The ${this.type} discard pile has been shuffled to form a new deck.`);
      this.shuffle();
    }

    return card;
  }

  public drawByCondition(logger: Logger, total: number, include: (card: T) => boolean) {
    const result: Array<T> = [];
    const discardedCards = new Set<CardName>();

    while (result.length < total) {
      if (discardedCards.size >= this.drawPile.length + this.discardPile.length) {
        logger.log(`discarded every ${this.type} card without a match`);
        break;
      }
      const projectCard = this.drawLegacy(logger);
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

  public discard(...cards: Array<T>): void {
    this.discardPile.push(...cards);
  }

  // For Junk Ventures
  public shuffleDiscardPile(): void {
    Deck.shuffle(this.discardPile, this.random);
  }

  public serialize(): SerializedDeck {
    return {
      drawPile: this.drawPile.map((c) => c.name),
      discardPile: this.discardPile.map((c) => c.name),
    };
  }
}

export class CorporationDeck extends Deck<ICorporationCard> {
  public constructor(deck: Array<ICorporationCard>, discarded: Array<ICorporationCard>, random: Random) {
    super('corporation', deck, discarded, random);
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<ICorporationCard> {
    const cardFinder = new CardFinder();

    const deck = cardFinder.corporationCardsFromJSON(d.drawPile);
    const discarded = cardFinder.corporationCardsFromJSON(d.discardPile);
    return new CorporationDeck(deck, discarded, random);
  }
}

export class ProjectDeck extends Deck<IProjectCard> {
  public constructor(deck: Array<IProjectCard>, discarded: Array<IProjectCard>, random: Random) {
    super('project', deck, discarded, random);
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<IProjectCard> {
    const cardFinder = new CardFinder();

    const deck = cardFinder.cardsFromJSON(d.drawPile);
    const discarded = cardFinder.cardsFromJSON(d.discardPile);
    return new ProjectDeck(deck, discarded, random);
  }
}

const INCOMPATIBLE_PRELUDES = [CardName.BY_ELECTION, CardName.THE_NEW_SPACE_RACE] as const;
export class PreludeDeck extends Deck<IPreludeCard> {
  public constructor(deck: Array<IPreludeCard>, discarded: Array<IPreludeCard>, random: Random) {
    const copy = [...deck];
    const indexes = INCOMPATIBLE_PRELUDES.map((name) => deck.findIndex((c) => c.name === name));
    if (indexes[0] >= 0 && indexes[1] >= 0) {
      // Remove one from the game, randomly
      const target = random.nextInt(2);
      const indexToRemove = indexes[target];
      copy.splice(indexToRemove, 1);
    }

    super('prelude', copy, discarded, random);
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<IPreludeCard> {
    const cardFinder = new CardFinder();

    const deck = <Array<IPreludeCard>>cardFinder.preludesFromJSON(d.drawPile);
    const discarded = cardFinder.preludesFromJSON(d.discardPile);
    return new PreludeDeck(deck, discarded, random);
  }
}

export class CeoDeck extends Deck<ICeoCard> {
  public constructor(deck: Array<ICeoCard>, discarded: Array<ICeoCard>, random: Random) {
    super('ceo', deck, discarded, random);
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<ICeoCard> {
    const cardFinder = new CardFinder();

    const deck = cardFinder.ceosFromJSON(d.drawPile);
    const discarded = cardFinder.ceosFromJSON(d.discardPile);
    return new CeoDeck(deck, discarded, random);
  }
}
