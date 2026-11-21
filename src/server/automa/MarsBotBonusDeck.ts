import {MarsBotBonusCard} from './MarsBotBonusCard';
import {MarsBotBonusDeckCard, createBaseBonusCards, createBonusCard, marsBotBonusCardsFromJSON} from './bonusCards/MarsBotBonusCards';
import {BonusCardId} from '../../common/automa/AutomaTypes';
import {Deck} from '../cards/Deck';
import {SerializedDeck} from '../cards/SerializedDeck';
import {Random} from '../../common/utils/Random';
import {inplaceRemove} from '../../common/utils/utils';

/** The MarsBot bonus card deck. */
export class MarsBotBonusDeck extends Deck<MarsBotBonusDeckCard> {
  public constructor(deck: Array<MarsBotBonusDeckCard>, discarded: Array<MarsBotBonusDeckCard>, random: Random) {
    super('marsbot', deck, discarded, random);
  }

  /**
   * Create the bonus deck for the expansions in play, shuffled.
   *
   * Venus Next replaces B06 (Lobbyists) with B15 (Lobbyists Venus). Colonies (C-2, C-3) replaces B05
   * (Expedited Construction) with B17 (Expedited Construction Colonies) and adds B18 (Outer System
   * Foothold); B19/B20 are set aside and injected into the action deck each generation (C-10/C-11).
   */
  public static create(random: Random, expansions: {venus?: boolean, colonies?: boolean} = {}): MarsBotBonusDeck {
    const cards = createBaseBonusCards();
    const replace = (id: BonusCardId, withId: BonusCardId) => {
      cards[cards.findIndex((c) => c.id === id)] = createBonusCard(withId);
    };
    if (expansions.venus) {
      replace(BonusCardId.B06_LOBBYISTS, BonusCardId.B15_LOBBYISTS_VENUS);
    }
    if (expansions.colonies) {
      replace(BonusCardId.B05_EXPEDITED_CONSTRUCTION, BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES);
      cards.push(createBonusCard(BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD));
    }
    const deck = new MarsBotBonusDeck(cards, [], random);
    deck.shuffle();
    return deck;
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<MarsBotBonusDeckCard> {
    const deck = marsBotBonusCardsFromJSON(d.drawPile);
    const discarded = marsBotBonusCardsFromJSON(d.discardPile);
    return new MarsBotBonusDeck(deck, discarded, random);
  }

  /** Find and remove a bonus card by ID from the draw pile. Returns the card or undefined. */
  public findAndRemove(bonusCardId: BonusCardId): MarsBotBonusCard | undefined {
    for (const pile of [this.drawPile, this.discardPile]) {
      const card = pile.find((c): c is MarsBotBonusCard => c.id === bonusCardId);
      if (card !== undefined) {
        inplaceRemove(pile, card);
        return card;
      }
    }
    return undefined;
  }

  /** Remove a bonus card from the deck entirely by ID (does not return it). */
  public removeById(bonusCardId: BonusCardId): void {
    this.drawPile = this.drawPile.filter((c) => c.id !== bonusCardId);
    this.discardPile = this.discardPile.filter((c) => c.id !== bonusCardId);
  }
}
