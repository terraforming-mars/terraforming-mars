import {SerializedDeck} from '@/server/cards/SerializedDeck';
import {CardName} from '@/common/cards/CardName';
import {Random} from '@/common/utils/Random';
import {inplaceShuffle} from '@/server/utils/shuffle';
import {Logger} from '@/server/logs/Logger';
import {toName} from '@/common/utils/utils';
import {Named} from '@/common/Types';

/**
 * A deck of cards to draw from, and also its discard pile.
 */
export class Deck<T extends Named<N>, N extends string = CardName> {
  protected readonly type: string;
  public drawPile: Array<T>;
  public discardPile: Array<T>;
  private readonly random: Random;

  // Exposing shuffle so it can be replaced in tests.
  public static shuffle(array: Array<unknown>, random: Random) {
    inplaceShuffle(array, random);
  }

  protected constructor(type: string, drawPile: Array<T>, discards: Array<T>, random: Random) {
    this.type = type;
    this.drawPile = drawPile;
    this.discardPile = discards;
    this.random = random;
  }

  public shuffle() {
    const copy = [...this.drawPile, ...this.discardPile];
    this.drawPile.splice(0, this.drawPile.length);
    this.discardPile.splice(0, this.discardPile.length);

    Deck.shuffle(copy, this.random);
    this.drawPile.push(...copy);
  }

  public draw(logger: Logger, source: 'top' | 'bottom' = 'top'): T | undefined {
    // Shuffle only when a draw finds the pile empty, so cards discarded after the last draw join the new deck.
    this.shuffleIfNecessary(logger);
    return source === 'top' ? this.drawPile.pop() : this.drawPile.shift();
  }

  public drawN(logger: Logger, count: number, source: 'top' | 'bottom' = 'top'): Array<T> {
    const cards: Array<T> = [];
    for (let idx = 0; idx < count; idx++) {
      const card = this.draw(logger, source);
      if (card === undefined) {
        break;
      }
      cards.push(card);
    }
    return cards;
  }

  drawNOrThrow(logger: Logger, count: number): Array<T> {
    const cards: Array<T> = [];
    for (let idx = 0; idx < count; idx++) {
      cards.push(this.drawOrThrow(logger));
    }
    return cards;
  }

  public size(): number {
    return this.drawPile.length + this.discardPile.length;
  }

  public canDraw(count: number): boolean {
    return this.size() >= count;
  }

  private shuffleIfNecessary(logger: Logger) {
    if (this.drawPile.length === 0 && this.discardPile.length !== 0) {
      logger.log(`The ${this.type} discard pile has been shuffled to form a new deck.`);
      this.shuffle();
    }
  }

  public drawOrThrow(logger: Logger, source: 'top' | 'bottom' = 'top'): T {
    const card = this.draw(logger, source);
    if (card === undefined) {
      throw new Error(`Unexpected empty ${this.type} deck`);
    }
    return card;
  }

  public discard(...cards: Array<T>): void {
    this.discardPile.push(...cards);
  }

  // For Junk Ventures
  public shuffleDiscardPile(): void {
    Deck.shuffle(this.discardPile, this.random);
  }

  public serialize(): SerializedDeck<N> {
    return {
      drawPile: this.drawPile.map(toName),
      discardPile: this.discardPile.map(toName),
    };
  }
}
