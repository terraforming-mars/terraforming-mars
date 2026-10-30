import {Tag} from '../../common/cards/Tag';
import {CardName} from '../../common/cards/CardName';
import {BonusCardId, CubeType} from '../../common/automa/AutomaTypes';
import {GlobalParameter} from '../../common/GlobalParameter';
import {TileType} from '../../common/TileType';
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {MarsBotBoard} from './MarsBotBoard';
import {Space} from '../boards/Space';
import {Expansion} from '../../common/cards/GameModule';

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

/**
 * A corp cube printed on the track of a tag (Aridor's "Jovian track #6"), wherever that tag's
 * track sits on the map's MarsBot board.
 */
export type MarsBotTagTrackCube = {
  trackTag: Tag;
  position: number;
  cubeType: CubeType;
};

/**
 * The corp's cubes on this board: tag-named cubes go to the track that carries the tag, and cubes
 * on a track the board lacks (Venus without Venus Next) are left out.
 */
export function corpTrackCubes(corp: IMarsBotCorp, marsBotBoard: MarsBotBoard): Array<MarsBotTrackCube> {
  const cubes: Array<MarsBotTrackCube> = [];
  for (const cube of corp.trackCubes ?? []) {
    const trackIndex = 'trackTag' in cube ? marsBotBoard.tagToTrack[cube.trackTag] : cube.trackIndex;
    if (trackIndex !== undefined && trackIndex < marsBotBoard.tracks.length) {
      cubes.push({trackIndex, position: cube.position, cubeType: cube.cubeType});
    }
  }
  return cubes;
}

/** Corp state key, set to 1 once the corp's `actionDeckBonusCard` removed itself from the game. */
export const ACTION_DECK_BONUS_CARD_REMOVED = 'actionDeckBonusCardRemoved';

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
  /** Expansions the corp card is marked with. The bot only draws it when at least one of them is in play. */
  readonly requiredExpansions?: ReadonlyArray<Expansion>;
  readonly draftPriority?: MarsBotDraftPriority;
  /** Runs once, right after the bot's corporation is chosen. */
  setup?(bot: IMarsBot): void;
  readonly effect?: MarsBotCorpEffect;
  /** A corp action taken at the start of every generation. */
  roundStart?(bot: IMarsBot): void;
  /** A corp action taken every generation, right before the action phase. */
  beforeActionPhase?(bot: IMarsBot): void;
  /**
   * The bonus card this corp puts in the action deck every generation.
   *
   * The card lives outside the bonus deck: after it resolves it waits for the next generation.
   * Once its removal condition removes it (Vitor's Overachievement), it stays out of the game.
   */
  readonly actionDeckBonusCard?: BonusCardId;
  /** Cubes seeded onto the bot's board tracks during setup. Read them through corpTrackCubes. */
  readonly trackCubes?: ReadonlyArray<MarsBotTrackCube | MarsBotTagTrackCube>;
  /**
   * True when the corp's cubes trigger on every advance onto their space, not only the first.
   *
   * The whole-track white cubes of the corps that pay "whenever advancing" on a track. After a
   * regression the space's icon still stays unresolved.
   */
  readonly trackCubesTriggerEveryAdvance?: boolean;
  /** M€ the bot gains per ocean next to a tile it places, when not the usual 2 (Lakefront). */
  readonly oceanAdjacencyMc?: number;
};

export type MarsBotCorpEffect = {
  /**
   * The bot's track marker reached one of this corp's cubes.
   *
   * Cube effects come on top of the icon printed on that space unless the corp's card says
   * otherwise: return true when the cube's effect replaces the icon (Helion's white cubes draw
   * a card instead of the temperature step under them), and the icon is then left unresolved.
   */
  onTrackCubeTrigger?(bot: IMarsBot, trackIndex: number, position: number, cubeType: CubeType): boolean | void;
  /**
   * The bot's track reached `position` and that space finished resolving, its icon included.
   *
   * Not called when the track moves back onto a space it regressed from.
   */
  afterTrackSpaceResolved?(bot: IMarsBot, trackIndex: number, position: number): void;
  /** The bot resolved a tag, on a project card or as one of its corp's starting tags. */
  onTagResolved?(bot: IMarsBot, tag: Tag): void;
  /** The bot drew and resolved a project card. */
  onProjectCardResolved?(bot: IMarsBot, card: IProjectCard): void;
  /** The human player played a card. */
  onHumanCardPlayed?(bot: IMarsBot, card: IProjectCard): void;
  /** A tile landed on `space`, placed by either side. */
  onTilePlaced?(bot: IMarsBot, placedByMarsBot: boolean, tileType: TileType, space: Space): void;
  /** Called after either player raises Venus, with the number of steps it actually moved. */
  onVenusRaised?(bot: IMarsBot, steps: number): void;
  /** Called before the bot raises a global parameter. Returning true cancels that raise: the global parameter stays at its current value. */
  interceptGlobalParameterRaise?(bot: IMarsBot, parameter: GlobalParameter): boolean;
  /** The bot's M€ supply just grew by this amount. */
  onMcGained?(bot: IMarsBot, amount: number): void;
  /** Either player built a colony (Poseidon, C33). */
  onColonyPlaced?(bot: IMarsBot): void;
  /** The bot took a Failed Action, after gaining its M€ for it. */
  onFailedAction?(bot: IMarsBot): void;
  /** The bot spent floaters to keep an extra card in the research phase. */
  onFloatersSpentForExtraCard?(bot: IMarsBot): void;
  /** Extra victory points added at final scoring. */
  vpBonus?(bot: IMarsBot): number;
  /** Points added to the bot's score in every award, when funding one and at final scoring. */
  awardScoreBonus?(bot: IMarsBot): number;
};

/** The bot as corp handlers see it, implemented by the bot manager. */
export interface IMarsBot {
  readonly game: IGame;
  /** The neutral player that holds the bot's terraform rating and owns its tiles. */
  readonly player: IPlayer;
  /** The human opponent. */
  readonly humanPlayer: IPlayer;
  readonly marsBotBoard: MarsBotBoard;

  /** The bot's M€ pool. */
  megacredits: number;
  /** The M€ a Failed Action pays at the game's difficulty. */
  readonly failedActionMc: number;
  /** M€ that Government Intervention lets the bot keep. Undefined outside Government Intervention. */
  mcKeptThroughIntervention: number | undefined;
  /** Floaters in the bot's floater pool, which it uses with Venus Next. */
  readonly floaters: number;
  /** Project cards the bot has drawn and resolved, in the order it played them. */
  readonly playedProjectCards: ReadonlyArray<IProjectCard>;
  /** How many times the bot has raised the temperature. */
  readonly temperatureRaises: number;
  /** How many bonus cards have been destroyed while the bot resolved them. */
  readonly destroyedBonusCards: number;
  /**
   * Adds floaters to the bot's floater pool with Venus Next.
   *
   * With Colonies and without Venus Next they go to its Titan storage area instead (C-14, C-23).
   */
  addFloaters(count: number): void;
  /** Removes floaters from where `addFloaters` puts them, stopping at zero. */
  spendFloaters(count: number): void;

  gainMc(amount: number): void;
  /** Positive steps raise the bot's TR, negative steps lower it. */
  raiseTR(steps: number): void;
  /** Advances a track and resolves the space it reaches. Does nothing once the game has ended. */
  advanceTrack(trackIndex: number): void;

  /**
   * Draws the top project card and resolves it as a bot action. The deck reshuffles its
   * discard pile when it runs out, so the bot does nothing only when both piles are empty, or
   * once the game has ended.
   */
  maybeDrawAndResolveProjectCard(): void;
  /** Same, but only the card's first tag resolves: the others are ignored. */
  maybeDrawAndResolveProjectCardFirstTagOnly(): void;
  /**
   * Draws the top bonus card and resolves it. Does nothing when both bonus piles are empty, or
   * once the game has ended.
   */
  maybeDrawAndResolveBonusCard(): void;
  /** Draws the top bonus card and shuffles it into the action deck. Does nothing when both bonus piles are empty. */
  maybeMoveBonusCardToActionDeck(): void;

  /**
   * Takes the bonus card dealt at setup out of the action deck and shuffles it back into the bonus
   * deck's draw pile. The expansion cards set aside for the action deck stay (UNMI, C12).
   */
  returnSetupBonusCardToBonusDeck(): void;

  /** Draws project cards and shuffles them into the bot's action deck. */
  drawProjectCardsToActionDeck(count: number): void;
  /**
   * Shuffles a bonus card into the action deck, pulling it from the bonus deck when present.
   *
   * Does nothing when the action deck already holds it.
   */
  addBonusCardToActionDeck(bonusCardId: BonusCardId): void;
  /** Shuffles a bonus card into the bonus deck's draw pile. */
  addBonusCardToBonusDeck(bonusCardId: BonusCardId): void;
  /** Puts a bonus card at the bottom of the bonus deck's draw pile. */
  addBonusCardToBottomOfBonusDeck(bonusCardId: BonusCardId): void;
  /**
   * Reveals project cards until `count` of them carry `tag`, and shuffles those into the bonus deck.
   *
   * The other revealed cards are discarded.
   */
  addProjectCardsToBonusDeck(tag: Tag, count: number): void;
  /**
   * Removes a bonus card from the bonus deck and from the action deck, for a corp's setup. When it
   * was the bonus card dealt at setup, the bonus deck deals a replacement into the action deck.
   */
  removeBonusCard(bonusCardId: BonusCardId): void;
  /** Resolves a bonus card's effect right away, outside the action deck. The card is not discarded. */
  resolveBonusCard(bonusCardId: BonusCardId): void;
  /**
   * Discards the project card with the fewest tags from the bot's action deck, the first one on a tie.
   *
   * Bonus cards are never chosen: with no project card in the action deck nothing is discarded.
   */
  maybeDiscardProjectCardWithFewestTags(): void;

  /**
   * Claims the milestone the bot's milestone track action would claim. Returns false, without
   * taking a Failed Action, when the bot cannot claim one.
   */
  maybeClaimMilestone(): boolean;
  /**
   * Funds the award the bot's award track action would fund. Returns false, without taking a
   * Failed Action, when the bot cannot fund one.
   */
  maybeFundAward(): boolean;

  /**
   * Raises the temperature for a corp effect. The steps it actually moves count toward
   * `temperatureRaises`. Unlike a track icon, a maxed temperature does nothing, with no Failed Action.
   */
  raiseTemperature(steps: 1 | 2): void;
  placeOcean(): void;
  placeCity(): void;
  placeGreenery(): void;
  /** Places a colony on a randomly selected eligible tile (Colonies rule C-15b). Returns true if placed. */
  maybePlaceRandomColony(): boolean;
  /** Takes the bot's player marker off `space`. True when the space had one. */
  removeMarker(space: Space): boolean;

  /** Corp-specific counters, serialized with the bot. Missing keys read as 0. */
  getCorpState(key: string): number;
  setCorpState(key: string, value: number): void;
}
