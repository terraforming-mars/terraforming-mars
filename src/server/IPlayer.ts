import {PlayerId, isPlayerId} from '../common/Types';
import {CardName} from '../common/cards/CardName';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IGame, isIGame} from './IGame';
import {Payment, PaymentOptions} from '../common/inputs/Payment';
import {SpendableCardResource} from '../common/inputs/Spendable';
import {ICard, IActionCard} from './cards/ICard';
import {TRSource} from '../common/cards/TRSource';
import {IProjectCard} from './cards/IProjectCard';
import {IPreludeCard} from './cards/prelude/IPreludeCard';
import {PlayerInput} from './PlayerInput';
import {Resource} from '../common/Resource';
import {CardResource} from '../common/CardResource';
import {SelectCard} from './inputs/SelectCard';
import {Priority} from './deferredActions/Priority';
import {SerializedPlayer} from './SerializedPlayer';
import {Timer} from '../common/Timer';
import {AllOptions, DrawOptions} from './deferredActions/DrawCards';
import {Units} from '../common/Units';
import {IStandardProjectCard} from './cards/IStandardProjectCard';
import {GlobalParameter} from '../common/GlobalParameter';
import {InputResponse} from '../common/inputs/InputResponse';
import {Tags} from './player/Tags';
import {Colonies} from './player/Colonies';
import {Production} from './player/Production';
import {ICeoCard} from './cards/ceos/ICeoCard';
import {VictoryPointsBreakdown} from '../common/game/VictoryPointsBreakdown';
import {Color} from '../common/Color';
import {OrOptions} from './inputs/OrOptions';
import {Stock} from './player/Stock';
import {UnderworldPlayerData} from '../common/underworld/UnderworldPlayerData';
import {AlliedParty} from '../common/turmoil/Types';
import {IParty} from './turmoil/parties/IParty';
import {Message} from '../common/logs/Message';
import {DiscordId} from './server/auth/discord';
import {PlayedCards} from './cards/PlayedCards';
import {From} from './logs/From';

/**
 * Represents additional costs a player must pay to execute an action.
 *
 * For instance, when finding a space to place a tile, it has to take into account
 * that the player must also pay some additional costs (e.g. additional TR from the
 * card's action, or resources they have to spend.)
 */
export type CanAffordOptions = Partial<PaymentOptions> & {
  cost: number,
  reserveUnits?: Units,
  tr?: TRSource,
  /** Represents when the action rewards the tile space more than once. */
  bonusMultiplier?: number,
}

/**
 * Behavior when playing a card:
 *   add it to the tableau
 *   discard it from the tableau
 *   only play the card (used for replaying a card)
 *   or do nothing.
 */
export type CardAction = 'add' | 'discard' | 'nothing' | 'double-down';

export interface IPlayer {
  readonly id: PlayerId;
  name: string;
  color: Color;
  beginner: boolean;
  handicap: number;

  readonly game: IGame;
  tags: Tags;
  colonies: Colonies;
  readonly production: Production;
  readonly stock: Stock;
  readonly terraformRating: number;
  readonly opponents: ReadonlyArray<IPlayer>;

  // Used only during set-up
  pickedCorporationCard?: ICorporationCard;

  // Terraforming Rating
  hasIncreasedTerraformRatingThisGeneration: boolean;

  // Resources
  megaCredits: number;
  steel: number;
  titanium: number;
  plants: number;
  energy: number;
  heat: number;

  // Helion
  canUseHeatAsMegaCredits: boolean;
  // Luna Trade Federation
  canUseTitaniumAsMegacredits: boolean;
  // Martian Lumber Corp
  canUsePlantsAsMegacredits: boolean;

  // This generation / this round
  actionsTakenThisRound: number;
  lastCardPlayed: CardName | undefined;
  pendingInitialActions: Array<ICorporationCard>;

  // Cards
  dealtCorporationCards: Array<ICorporationCard>;
  dealtPreludeCards: Array<IPreludeCard>;
  dealtCeoCards: Array<ICeoCard>;
  dealtProjectCards: Array<IProjectCard>;
  cardsInHand: Array<IProjectCard>;
  preludeCardsInHand: Array<IPreludeCard>;
  ceoCardsInHand: Set<IProjectCard>;
  playedCards: PlayedCards;
  cardCost: number;
  // This will eventually replace playedCards.
  tableau: PlayedCards;

  /** Cards this player has in their draft hand. Player chooses from them, and passes them to the next player */
  draftHand: Array<IProjectCard>;
  /** Cards this player has already chosen during this draft round */
  draftedCards: Array<IProjectCard>;
  /** true when this player is drafting, false when player is not, undefined when there is no draft phase. */
  needsToDraft?: boolean;

  timer: Timer;

  // Turmoil
  turmoilPolicyActionUsed: boolean;
  politicalAgendasActionUsedCount: number;

  /** Lakefront Resorts increases ocean adjacency to 3 MC  */
  oceanBonus: number;

  // Custom cards
  // PoliticalAgendas Scientists P41
  hasTurmoilScienceTagBonus: boolean;
  // Ecoline
  plantsNeededForGreenery: number;
  // Lawsuit
  removingPlayers: Array<PlayerId>;
  // For Playwrights corp.
  // removedFromPlayCards is a bit of a misname: it's a temporary storage for
  // cards that provide 'next card' discounts. This will clear between turns.
  removedFromPlayCards: Array<IProjectCard>;
  /**
   * When true, Preservation Program is in effect, and the player has not triggered a TR gain this generation.
   *
   * False when the player does not have Preservation Program, or after the first TR in the action phase.
   */
  preservationProgram: boolean;
  /**
   * The list of standard projects (EXCEPT SELL PATENTS) this player has taken this generation.
   *
   * For Underworld: Standard Technology and Labor Trafficking
   *
   * Note: Sell Patents is absent to simplify Labor Trafficking. It's also not necessary.
   */
  standardProjectsThisGeneration: Set<CardName>;

  /**
   * For Hollandia. When true, player has tiles on Mars, and all of them are in the deflection zone.
   * False when the player has any tiles on Mars outside the deflection zone, and also false when the
   * player has no tiles on Mars.
   */
  withinDeflectionZone: boolean;

  // The number of actions a player can take this round.
  // It's almost always 2, but certain cards can change this value.
  //
  // This value isn't serialized. Probably ought to.
  availableActionsThisRound: number;

  // Stats
  actionsTakenThisGame: number;
  victoryPointsByGeneration: Array<number>;
  totalDelegatesPlaced: number;

  underworldData: UnderworldPlayerData;
  readonly alliedParty?: AlliedParty;

  tearDown(): void;

  // When set, this player can only be accessed by the user.
  user?: DiscordId;

  setup(game: IGame): void;

  getTitaniumValue(): number;
  increaseTitaniumValue(): void;
  decreaseTitaniumValue(): void;
  getSelfReplicatingRobotsTargetCards(): Array<IProjectCard>;
  getSteelValue(): number;
  increaseSteelValue(): void;
  decreaseSteelValue(): void;
  /** @deprecated use #terraformRating. */
  getTerraformRating(): number;
  increaseTerraformRating(steps?: number, opts?: {log?: boolean, from?: From}): void;
  decreaseTerraformRating(steps?: number, opts?: {log?: boolean}): void;
  setTerraformRating(value: number): void;

  // The action cards used this generation.
  actionsThisGeneration: Set<CardName>;
  getVictoryPoints(): VictoryPointsBreakdown;
  plantsAreProtected(): boolean;
  alloysAreProtected(): boolean;
  /**
   * Return true when |resource| cannot be stolen from this player.
   */
  isProtected(resource: Resource | keyof Units): boolean;
  /**
   * Returns true when this player can lose |minQuantity| units of production.
   *
   * This typically means they have the required units of production, and that production
   * isn't protected.
   */
  canHaveProductionReduced(resource: Resource, minQuantity: number, attacker: IPlayer): boolean;
  /**
   * Give this player a chance to block an attack made by `perpetrator`. Call `cb` with true if the attack
   * is not blocked.
   */
  maybeBlockAttack(perpetrator: IPlayer, message: Message | string, cb: (proceed: boolean) => PlayerInput | undefined): void;

  /**
   * Remove or steal standard resources from another player. Could be blocked (see `maybeBlockAttack`.)
   *
   * Nothing happens if count is 0.
   */
  attack(perpetrator: IPlayer, type: Resource, count: number, options?: {log?: boolean, stealing?: boolean}): void;

  /**
   * In the multiplayer game, after an attack, the attacked player makes a claim
   * for insurance. If Mons Insurance is in the game, the claimant will receive
   * as much as possible from the insurer.
   *
   * `this` is the attacked player.
   */
  resolveInsurance(): void;
  /**
   * In the solo game, Mons Insurance is only held by the sole player, who will
   * have to pay the penalty for hurting the neutral player.
   *
   * `this` is the potentialInsurer: the solo player in the game. It's not
   * clear yet whether the player has Mons Insurance, but if they do, they will
   * pay. Unlike `resolveInsurance`, there is no claimant Player so the money
   * disappears.
   */
  resolveInsuranceInSoloGame(): void;
  /**
   * Returns the number of colonies this player has on all the colony types.
   *
   * If Colonies is not in this game, this returns 0.
   */
  getColoniesCount(): number;
  /**
   * Count the number of cards in the player's event pile.
   */
  getPlayedEventsCount(): number;
  /**
   * For the given global parameter, return a sum of all requirements bonuses this
   * player has thanks to played cards, Turmoil policies, etcetera.
   */
  getGlobalParameterRequirementBonus(parameter: GlobalParameter): number;
  /**
   * When Ecology Experts evaluates whether it can be played, it needs
   * this temporary requirement bonus for global parameters.
   */
  temporaryGlobalParameterRequirementBonus: number;
  /**
   * Called when this player is responsible for increasing a global parameter.
   */
  onGlobalParameterIncrease(parameter: GlobalParameter, steps: number): void;
  readonly globalParameterSteps: Record<GlobalParameter, number>;
  /**
   * Remove resources from this player's played card
   */
  removeResourceFrom(card: ICard, count?: number, options?: {removingPlayer? : IPlayer, log?: boolean}): void;
  /**
   * Add resources to this player's played card
   */
  addResourceTo(card: ICard, options?: number | {qty?: number, log: boolean, logZero?: boolean}): void;

  /**
   * Returns the set of cards in play that have actual resources on them.
   *
   * Use |getResourceCards| to return all cards, even without resources on them.
   *
   * If `resource` is absent, include cards that collect any resource.
   */
  getCardsWithResources(resource?: CardResource): Array<ICard>;

  /**
   * Return the cards that collect `resource`, even if they have none on the card.
   *
   * Use |getCardsWithResources| to return only cards with resources on them.
   *
   * If `resource` is absent, return the cards that collect any resource.
   */
  getResourceCards(resource?: CardResource): Array<ICard>;

  /**
   * Count all the resources of a given type in the tableau.
   */
  getResourceCount(resource: CardResource): number;
  getPlayableActionCards(): Array<ICard & IActionCard>;
  runProductionPhase(): void;
  finishProductionPhase(): void;

  runResearchPhase(): void;
  getCardCost(card: IProjectCard): number;

  /** The number of resources on this card for this player, or 0 if the player does not have this card. */
  resourcesOnCard(name: CardName): number;
  spendableMegacredits(): number;
  /** Return then amount of spendable units of a given card resource */
  getSpendable(resource: SpendableCardResource): number;
  checkPaymentAndPlayCard(selectedCard: IProjectCard, payment: Payment, cardAction?: CardAction): void;
  pay(payment: Payment): void;
  availableHeat(): number;
  spendHeat(amount: number, cb?: () => (undefined | PlayerInput)) : PlayerInput | undefined;

  playCard(selectedCard: IProjectCard, payment?: Payment, cardAction?: CardAction): void;
  onCardPlayed(card: ICard): void;
  playCorporationCard(corporationCard: ICorporationCard): void;
  drawCard(count?: number, options?: DrawOptions): void;
  drawCardKeepSome(count: number, options: AllOptions): void;
  discardPlayedCard(card: IProjectCard): void;
  discardCardFromHand(card: IProjectCard, options?: {log?: boolean}): void;

  /** Player has prestated they want to pass on their next turn */
  autopass: boolean;
  /** Player is done taking actions this generation. */
  pass(): void;
  takeActionForFinalGreenery(): void;
  getPlayableCards(): Array<IProjectCard>;
  canPlay(card: IProjectCard): boolean;
  canSpend(payment: Payment, reserveUnits?: Units): boolean;
  payingAmount(payment: Payment, options?: Partial<PaymentOptions>): number;
  /**
   * Returns a summary of how much a player would have to spend to play a card,
   * any associated costs, and ways the player can pay.
   */
  affordOptionsForCard(card: IProjectCard): CanAffordOptions;
  canAfford(options: number | CanAffordOptions): boolean;
  getStandardProjectOption(): SelectCard<IStandardProjectCard>;
  takeAction(saveBeforeTakingAction?: boolean): void;
  /** Return possible mid-game actions like play a card and fund an award, but not play prelude card. */
  getActions(): OrOptions;
  process(input: InputResponse): void;
  getWaitingFor(): PlayerInput | undefined;
  setWaitingFor(input: PlayerInput, cb?: () => void): void;
  setWaitingForSafely(input: PlayerInput, cb?: () => void): void;
  serialize(): SerializedPlayer;

  /** Returns the cost a player must spend to claim a milestone. Public for Briber. */
  milestoneCost(): number;

  /** Shorthand for deferring evaluating a PlayerInput */
  defer(input: PlayerInput | undefined | void | (() => PlayerInput | undefined | void), priority?: Priority): void;
  setAlliedParty(party: IParty): void;
}

export function isIPlayer(object: any): object is IPlayer {
  return object !== undefined && object.hasOwnProperty('id') && isPlayerId(object.id) && isIGame(object.game);
}
