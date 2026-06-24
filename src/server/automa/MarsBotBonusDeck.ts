import {MarsBotBonusCard, createBaseBonusCards} from './MarsBotBonusCard';
import {Random} from '../../common/utils/Random';
import {inplaceShuffle} from '../utils/shuffle';

/**
 * Manages the MarsBot bonus card deck.
 * Cards flow: drawPile -> (resolved) -> discardPile, and the discard pile is
 * reshuffled back into the draw pile when it runs out.
 */
export class MarsBotBonusDeck {
  public drawPile: Array<MarsBotBonusCard>;
  public discardPile: Array<MarsBotBonusCard> = [];

  constructor(
    cards: Array<MarsBotBonusCard>,
    private readonly random: Random,
  ) {
    this.drawPile = [...cards];
    inplaceShuffle(this.drawPile, this.random);
  }

  /** Create the base game bonus deck (B01-B08), shuffled. */
  public static createBase(random: Random): MarsBotBonusDeck {
    return new MarsBotBonusDeck(createBaseBonusCards(), random);
  }

  /** Draw 1 bonus card. Reshuffles the discard pile into the draw pile if empty. */
  public draw(): MarsBotBonusCard | undefined {
    if (this.drawPile.length === 0) {
      this.reshuffleDiscard();
    }
    return this.drawPile.pop();
  }

  /** Place a resolved bonus card into the discard pile. */
  public discard(card: MarsBotBonusCard): void {
    this.discardPile.push(card);
  }

  /** Shuffle the discard pile back into the draw pile. */
  private reshuffleDiscard(): void {
    this.drawPile = this.discardPile;
    this.discardPile = [];
    inplaceShuffle(this.drawPile, this.random);
  }
}
