import {MarsBotBonusCard, createBaseBonusCards, createCorpBonusCard, marsBotBonusCardsFromJSON} from './MarsBotBonusCard';
import {BonusCardId} from '../../common/automa/AutomaTypes';
import {Deck} from '../cards/Deck';
import {SerializedDeck} from '../cards/SerializedDeck';
import {Random} from '../../common/utils/Random';

/** The MarsBot bonus card deck. */
export class MarsBotBonusDeck extends Deck<MarsBotBonusCard> {
  public constructor(deck: Array<MarsBotBonusCard>, discarded: Array<MarsBotBonusCard>, random: Random) {
    super('marsbot', deck, discarded, random);
  }

  private static create(cards: Array<MarsBotBonusCard>, random: Random): MarsBotBonusDeck {
    const deck = new MarsBotBonusDeck(cards, [], random);
    deck.shuffle();
    return deck;
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

  /** Create bonus deck with Venus Next: replace B06 (Lobbyists) with B15 (Lobbyists Venus). */
  public static createWithVenus(random: Random): MarsBotBonusDeck {
    const cards = createBaseBonusCards();
    const idx = cards.findIndex((c) => c.id === BonusCardId.B06_LOBBYISTS);
    if (idx >= 0) {
      cards[idx] = createCorpBonusCard(BonusCardId.B15_LOBBYISTS_VENUS);
    }
    return MarsBotBonusDeck.create(cards, random);
  }

  /**
   * Create bonus deck with Colonies (C-2, C-3):
   * Replace B05 (Expedited Construction) with B17 (Expedited Construction Colonies).
   * Add B18 (Outer System Foothold) to the deck.
   * B19/B20 are set aside and injected into the action deck each generation (C-10/C-11).
   */
  public static createWithColonies(random: Random): MarsBotBonusDeck {
    const cards = createBaseBonusCards();
    const idx = cards.findIndex((c) => c.id === BonusCardId.B05_EXPEDITED_CONSTRUCTION);
    if (idx >= 0) {
      cards[idx] = createCorpBonusCard(BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES);
    }
    cards.push(createCorpBonusCard(BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD));
    return MarsBotBonusDeck.create(cards, random);
  }

  /**
   * Create bonus deck with both Venus Next and Colonies:
   * Replace B05 with B17 (Colonies), replace B06 with B15 (Venus), add B18.
   */
  public static createWithVenusAndColonies(random: Random): MarsBotBonusDeck {
    const cards = createBaseBonusCards();
    const b05Idx = cards.findIndex((c) => c.id === BonusCardId.B05_EXPEDITED_CONSTRUCTION);
    if (b05Idx >= 0) {
      cards[b05Idx] = createCorpBonusCard(BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES);
    }
    const b06Idx = cards.findIndex((c) => c.id === BonusCardId.B06_LOBBYISTS);
    if (b06Idx >= 0) {
      cards[b06Idx] = createCorpBonusCard(BonusCardId.B15_LOBBYISTS_VENUS);
    }
    cards.push(createCorpBonusCard(BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD));
    return MarsBotBonusDeck.create(cards, random);
  }
}
