import {BonusCardId} from '../../common/automa/AutomaTypes';
import {Tag} from '../../common/cards/Tag';
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {MarsBotBoard} from './MarsBotBoard';
import {Space} from '../boards/Space';

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
  /** Same as `maybeDrawAndResolveProjectCard`, but only the card's first tag resolves: the others are ignored. */
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
