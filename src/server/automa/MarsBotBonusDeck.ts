import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {Deck} from '../cards/Deck';
import {SerializedDeck} from '../cards/SerializedDeck';
import {Random} from '../../common/utils/Random';

/** The bonus cards in the base game deck (B01-B08), before any expansion swaps some out. */
export const BASE_BONUS_CARDS: ReadonlyArray<BonusCardName> = [
  BonusCardName.METEOR_SHOWER,
  BonusCardName.INVASIVE_SPECIES,
  BonusCardName.RESEARCH_AND_DEVELOPMENT,
  BonusCardName.OVERACHIEVEMENT,
  BonusCardName.EXPEDITED_CONSTRUCTION,
  BonusCardName.LOBBYISTS,
  BonusCardName.LOCAL_NEURAL_INSTANCE,
  BonusCardName.CORPORATE_COMPETITION,
];

/** The MarsBot bonus card deck. */
export class MarsBotBonusDeck extends Deck<MarsBotBonusCard, BonusCardName> {
  public constructor(deck: Array<MarsBotBonusCard>, discarded: Array<MarsBotBonusCard>, random: Random) {
    super('marsbot', deck, discarded, random);
  }

  /**
   * Creates the bonus deck for the expansions in play, shuffled.
   *
   * Venus Next replaces B06 (Lobbyists) with B15 (Lobbyists Venus). Colonies replaces B05
   * (Expedited Construction) with B17 (Expedited Construction Colonies) and adds B18 (Outer System
   * Foothold); B19/B20 are set aside and injected into the action deck each generation (rulebook C, p.4).
   */
  public static create(random: Random, expansions: {venus?: boolean, colonies?: boolean} = {}): MarsBotBonusDeck {
    const cards = BASE_BONUS_CARDS.map(createBonusCard);
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
