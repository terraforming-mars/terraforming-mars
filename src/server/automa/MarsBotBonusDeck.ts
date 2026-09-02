import {MarsBotBonusCard, createBaseBonusCards, marsBotBonusCardsFromJSON} from './MarsBotBonusCard';
import {Deck} from '../cards/Deck';
import {SerializedDeck} from '../cards/SerializedDeck';
import {Random} from '../../common/utils/Random';

/** The MarsBot bonus card deck. */
export class MarsBotBonusDeck extends Deck<MarsBotBonusCard> {
  public constructor(deck: Array<MarsBotBonusCard>, discarded: Array<MarsBotBonusCard>, random: Random) {
    super('marsbot', deck, discarded, random);
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
