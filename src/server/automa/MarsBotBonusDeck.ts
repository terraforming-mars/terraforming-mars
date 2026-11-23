import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {BoardName} from '@/common/boards/BoardName';
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

/** The Corporate Competition card that replaces B08 on each board other than Tharsis (rulebook C, p.8). */
const CORPORATE_COMPETITION_FOR_BOARD: Partial<Record<BoardName, BonusCardName>> = {
  [BoardName.HELLAS]: BonusCardName.CORPORATE_COMPETITION_HELLAS,
  [BoardName.ELYSIUM]: BonusCardName.CORPORATE_COMPETITION_ELYSIUM,
  [BoardName.UTOPIA_PLANITIA]: BonusCardName.CORPORATE_COMPETITION_UTOPIA,
  [BoardName.TERRA_CIMMERIA_NOVA]: BonusCardName.CORPORATE_COMPETITION_CIMMERIA,
  [BoardName.VASTITAS_BOREALIS_NOVA]: BonusCardName.CORPORATE_COMPETITION_BOREALIS,
};

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
   *
   * The board's own Corporate Competition (B09-B13) replaces B08, or B14 with the Milestones & Awards
   * expansion whatever the board (rulebook C, p.8 and p.13).
   */
  public static create(
    random: Random,
    expansions: {venus?: boolean, colonies?: boolean, boardName?: BoardName, modularMA?: boolean} = {}): MarsBotBonusDeck {
    const cards = BASE_BONUS_CARDS.map(createBonusCard);
    const replace = (name: BonusCardName, withName: BonusCardName) => {
      cards[cards.findIndex((c) => c.name === name)] = createBonusCard(withName);
    };
    const corporateCompetition = expansions.modularMA ?
      BonusCardName.CORPORATE_COMPETITION_MA :
      CORPORATE_COMPETITION_FOR_BOARD[expansions.boardName ?? BoardName.THARSIS];
    if (corporateCompetition !== undefined) {
      replace(BonusCardName.CORPORATE_COMPETITION, corporateCompetition);
    }
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
