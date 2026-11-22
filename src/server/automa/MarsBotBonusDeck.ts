import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {createBaseBonusCards, createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {Deck} from '../cards/Deck';
import {SerializedDeck} from '../cards/SerializedDeck';
import {Random} from '../../common/utils/Random';

/** The MarsBot bonus card deck. */
export class MarsBotBonusDeck extends Deck<MarsBotBonusCard, BonusCardName> {
  public constructor(deck: Array<MarsBotBonusCard>, discarded: Array<MarsBotBonusCard>, random: Random) {
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
    const replace = (name: BonusCardName, withName: BonusCardName) => {
      cards[cards.findIndex((c) => c.name === name)] = createBonusCard(withName);
    };
    if (expansions.venus) {
      replace(BonusCardName.LOBBYISTS, BonusCardName.LOBBYISTS_VENUS);
    }
    if (expansions.colonies) {
      replace(BonusCardName.EXPEDITED_CONSTRUCTION, BonusCardName.EXPEDITED_CONSTRUCTION_COLONIES);
      cards.push(createBonusCard(BonusCardName.OUTER_SYSTEM_FOOTHOLD));
    }
    const deck = new MarsBotBonusDeck(cards, [], random);
    deck.shuffle();
    return deck;
  }

  public static deserialize(d: SerializedDeck<BonusCardName>, random: Random): MarsBotBonusDeck {
    const deck = d.drawPile.map(createBonusCard);
    const discarded = d.discardPile.map(createBonusCard);
    return new MarsBotBonusDeck(deck, discarded, random);
  }
}
