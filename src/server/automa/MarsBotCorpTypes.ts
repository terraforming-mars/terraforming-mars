import {Tag} from '../../common/cards/Tag';
import {CardName} from '../../common/cards/CardName';
import {BonusCardId, CubeType} from '../../common/automa/AutomaTypes';
import {GlobalParameter} from '../../common/GlobalParameter';
import {TileType} from '../../common/TileType';
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {MarsBotBoard} from './MarsBotBoard';

/**
 * Types for MarsBot corporations, the corp cards from the Automa expansion.
 *
 * A MarsBot corp names the real corporation it stands in for and defines what
 * the bot does with it: which cards it prefers in the draft, cubes seeded on
 * its board tracks, one-time setup, hooks that fire during play, and an action
 * taken each generation. Corp definitions are plain data plus small handler
 * functions; the bot manager owns the selected corp and calls into it.
 */

/** How the bot picks a card in the research draft. Each corp names one priority. */
export type MarsBotDraftPriority =
  | { type: 'tags'; tags: Array<Tag> }
  | { type: 'mostExpensive' }
  | { type: 'leastAdvancedTrack' }
  | { type: 'mostTags' };

/**
 * A cube a corp places on the bot's board during setup. It triggers the corp's
 * onTrackCubeTrigger hook once, when the track marker reaches its position.
 */
export type MarsBotTrackCube = {
  trackIndex: number;
  position: number;
  cubeType: CubeType;
};

/** Keys cube positions in maps, and in the set of cubes that already triggered. */
export function trackCubeKey(trackIndex: number, position: number): string {
  return `${trackIndex}:${position}`;
}

export type IMarsBotCorp = {
  /** The corporation card this bot corp stands in for. */
  readonly name: CardName;
  /** Rules summary shown to the human player. */
  readonly description: string;
  /** Tags printed on the corp card. They count toward the bot's tag totals for the whole game. */
  readonly tags: ReadonlyArray<Tag>;
  readonly draftPriority?: MarsBotDraftPriority;
  /** Runs once, right after the bot's corporation is chosen. */
  setup?(bot: IMarsBot): void;
  readonly effect?: MarsBotCorpEffect;
  readonly perGeneration?: MarsBotCorpPerGen;
  /** Cubes seeded onto the bot's board tracks during setup. */
  readonly trackCubes?: ReadonlyArray<MarsBotTrackCube>;
};

/** Corp abilities that react to game events. All hooks are optional. */
export type MarsBotCorpEffect = {
  /** The bot's track marker reached one of this corp's cubes. */
  onTrackCubeTrigger?(bot: IMarsBot, trackIndex: number, position: number, cubeType: CubeType): void;
  /** The bot drew and resolved a project card. */
  onProjectCardResolved?(bot: IMarsBot, card: IProjectCard): void;
  /** The human player played a card. */
  onHumanCardPlayed?(bot: IMarsBot, card: IProjectCard): void;
  /** A tile landed on the board, placed by either side. */
  onTilePlaced?(bot: IMarsBot, placedByMarsBot: boolean, tileType: TileType): void;
  onVenusRaised?(bot: IMarsBot): void;
  /** Fires before a global parameter raise. Return true to skip the raise. */
  onGlobalParameterRaised?(bot: IMarsBot, parameter: GlobalParameter): boolean;
  /** Fires when the bot is about to gain M€. Returns the amount that actually reaches the supply. */
  onMcGained?(bot: IMarsBot, amount: number): number;
  /** Fired when MarsBot places a colony on any tile (Colonies rule C-33). */
  onColonyPlaced?(bot: IMarsBot): void;
  /** Extra victory points added at final scoring. */
  vpBonus?(bot: IMarsBot): number;
};

/** A corp action taken every generation, at the given point in the round. */
export type MarsBotCorpPerGen = {
  timing: 'roundStart' | 'beforeActionPhase';
  resolve(bot: IMarsBot): void;
};

/**
 * The bot as corp handlers see it, implemented by the bot manager. Like
 * IPlayer, it keeps its own state next to a game reference; the game reference
 * is dropped when the bot is serialized and restored on load.
 */
export interface IMarsBot {
  readonly game: IGame;
  /** The neutral player that holds the bot's terraform rating and owns its tiles. */
  readonly player: IPlayer;
  readonly board: MarsBotBoard;

  /** The bot's M€ pool. */
  mcSupply: number;
  /** Floaters stored by Venus corps. */
  readonly floaterCount: number;
  addFloaters(count: number): void;
  /** Removes floaters, stopping at zero. */
  spendFloaters(count: number): void;

  gainMc(amount: number): void;
  /** Positive steps raise the bot's TR, negative steps lower it. */
  raiseTR(steps: number): void;
  advanceTrack(trackIndex: number): void;

  /** Draws the top project card and resolves it as a bot action. False when the deck is empty. */
  drawAndResolveProjectCard(): boolean;
  /** Same, but the card's first n tags are ignored while resolving. */
  drawAndResolveProjectCardIgnoringFirstNTags(n: number): boolean;
  /** Draws the top bonus card and resolves it. False when the deck is empty. */
  drawAndResolveBonusCard(): boolean;

  /** Draws project cards into the bot's action deck. */
  drawProjectCardsToActionDeck(count: number): void;
  /** Puts a bonus card in the action deck, pulling it from the bonus deck when present. */
  addBonusCardToActionDeck(bonusCardId: BonusCardId): void;
  addBonusCardToBonusDeck(bonusCardId: BonusCardId): void;
  /** Removes a bonus card from the bonus deck and from the action deck. */
  removeBonusCard(bonusCardId: BonusCardId): void;
  /** Discards the action-deck card with the fewest tags. */
  discardFewestTagsFromActionDeck(): void;

  raiseTemperature(steps: 1 | 2 | 3): void;
  placeOcean(): void;
  placeCity(): void;
  placeGreenery(): void;
  /** Places a colony on a randomly selected eligible tile (Colonies rule C-15b). Returns true if placed. */
  placeRandomColony(): boolean;

  /** Corp-specific counters, serialized with the bot. Missing keys read as 0. */
  getCorpState(key: string): number;
  setCorpState(key: string, value: number): void;
}
