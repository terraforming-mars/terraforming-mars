import {MarsBotBonusCard, createBaseBonusCards, marsBotBonusCardsFromJSON} from './MarsBotBonusCard';
import {Deck} from '../cards/Deck';
import {SerializedDeck} from '../cards/SerializedDeck';
import {Random} from '../../common/utils/Random';
import {Logger} from '../logs/Logger';

/** The MarsBot bonus card deck. */
export class MarsBotBonusDeck extends Deck<MarsBotBonusCard> {
  public constructor(deck: Array<MarsBotBonusCard>, discarded: Array<MarsBotBonusCard>, random: Random) {
    super('marsbot', deck, discarded, random);
  }

  /**
   * Reshuffles only when a draw finds the deck empty, when the last card drawn is in the discards too.
   * Deck.draw also reshuffles right after drawing the last card, which leaves that card out.
   */
  public override draw(logger: Logger, source: 'top' | 'bottom' = 'top'): MarsBotBonusCard | undefined {
    if (this.drawPile.length === 0 && this.discardPile.length !== 0) {
      logger.log('The marsbot discard pile has been shuffled to form a new deck.');
      this.shuffle();
    }
    return source === 'top' ? this.drawPile.pop() : this.drawPile.shift();
  }

  /** Create the base game bonus deck (B01-B08), shuffled. */
  public static createBase(random: Random): MarsBotBonusDeck {
    const deck = new MarsBotBonusDeck(createBaseBonusCards(), [], random);
    deck.shuffle();
    return deck;
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<MarsBotBonusCard> {
    const deck = marsBotBonusCardsFromJSON(d.drawPile);
    const discarded = marsBotBonusCardsFromJSON(d.discardPile);
    return new MarsBotBonusDeck(deck, discarded, random);
  }
}
