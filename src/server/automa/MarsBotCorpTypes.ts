import {Tag} from '../../common/cards/Tag';
import {CardName} from '../../common/cards/CardName';
import {BonusCardId, CubeType} from '../../common/automa/AutomaTypes';
import {GlobalParameter} from '../../common/GlobalParameter';
import {TileType} from '../../common/TileType';
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {MarsBotBoard} from './MarsBotBoard';

/** How the bot picks a card in the research draft. Each corp names one priority. */
export type MarsBotDraftPriority =
  | { type: 'tags'; tags: Array<Tag> }
  | { type: 'mostExpensive' }
  | { type: 'leastAdvancedTrack' }
  | { type: 'mostTags' };

/** A cube on the corp's track, including its type and position within a track. */
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
  /** A corp action taken at the start of every generation. */
  roundStart?(bot: IMarsBot): void;
  /** A corp action taken every generation, right before the action phase. */
  beforeActionPhase?(bot: IMarsBot): void;
  /** Cubes seeded onto the bot's board tracks during setup. */
  readonly trackCubes?: ReadonlyArray<MarsBotTrackCube>;
};

export type MarsBotCorpEffect = {
  /** The bot's track marker reached one of this corp's cubes. */
  onTrackCubeTrigger?(bot: IMarsBot, trackIndex: number, position: number, cubeType: CubeType): void;
  /** The bot drew and resolved a project card. */
  onProjectCardResolved?(bot: IMarsBot, card: IProjectCard): void;
  /** The human player played a card. */
  onHumanCardPlayed?(bot: IMarsBot, card: IProjectCard): void;
  /** A tile landed on the board, placed by either side. */
  onTilePlaced?(bot: IMarsBot, placedByMarsBot: boolean, tileType: TileType): void;
  /** Called once after the bot raises Venus, however many steps it moved. */
  onVenusRaised?(bot: IMarsBot): void;
  /** Called before the bot raises a global parameter. Returning true cancels that raise: the global parameter stays at its current value. */
  interceptGlobalParameterRaise?(bot: IMarsBot, parameter: GlobalParameter): boolean;
  /** The bot's M€ supply just grew by this amount. */
  onMcGained?(bot: IMarsBot, amount: number): void;
  /** Fired when MarsBot places a colony on any tile (Colonies rule C-33). */
  onColonyPlaced?(bot: IMarsBot): void;
  /** Extra victory points added at final scoring. */
  vpBonus?(bot: IMarsBot): number;
};

/** The bot as corp handlers see it, implemented by the bot manager. */
export interface IMarsBot {
  readonly game: IGame;
  /** The neutral player that holds the bot's terraform rating and owns its tiles. */
  readonly player: IPlayer;
  readonly marsBotBoard: MarsBotBoard;

  /** The bot's M€ pool. */
  megacredits: number;
  /** Floaters stored by Venus corps. */
  readonly floaters: number;
  addFloaters(count: number): void;
  /** Removes floaters, stopping at zero. */
  spendFloaters(count: number): void;

  gainMc(amount: number): void;
  /** Positive steps raise the bot's TR, negative steps lower it. */
  raiseTR(steps: number): void;
  advanceTrack(trackIndex: number): void;

  /**
   * Draws the top project card and resolves it as a bot action. The deck reshuffles its
   * discard pile when it runs out, so the bot does nothing only when both piles are empty.
   */
  maybeDrawAndResolveProjectCard(): void;
  /** Same, but the card's first n tags are ignored while resolving. */
  maybeDrawAndResolveProjectCardIgnoringFirstNTags(n: number): void;
  /** Draws the top bonus card and resolves it. Does nothing when both bonus piles are empty. */
  maybeDrawAndResolveBonusCard(): void;

  /** Draws project cards into the bot's action deck. */
  drawProjectCardsToActionDeck(count: number): void;
  /** Puts a bonus card in the action deck, pulling it from the bonus deck when present. */
  addBonusCardToActionDeck(bonusCardId: BonusCardId): void;
  addBonusCardToBonusDeck(bonusCardId: BonusCardId): void;
  /** Removes a bonus card from the bonus deck and from the action deck. */
  removeBonusCard(bonusCardId: BonusCardId): void;
  /** Discards the card with the fewest tags from the bot's action deck. */
  discardCardWithFewestTags(): void;

  raiseTemperature(steps: 1 | 2 | 3): void;
  placeOcean(): void;
  placeCity(): void;
  placeGreenery(): void;
  /** Places a colony on a randomly selected eligible tile (Colonies rule C-15b). Returns true if placed. */
  maybePlaceRandomColony(): boolean;

  /** Corp-specific counters, serialized with the bot. Missing keys read as 0. */
  getCorpState(key: string): number;
  setCorpState(key: string, value: number): void;
}
