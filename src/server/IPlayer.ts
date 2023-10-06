import {PlayerId, isPlayerId} from '../common/Types';
import {CardName} from '../common/cards/CardName';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IGame, isIGame} from './IGame';
import {Payment, PaymentOptions} from '../common/inputs/Payment';
import {ICard, IActionCard, DynamicTRSource} from './cards/ICard';
import {TRSource} from '../common/cards/TRSource';
import {IProjectCard} from './cards/IProjectCard';
import {PlayerInput} from './PlayerInput';
import {Resource} from '../common/Resource';
import {CardResource} from '../common/CardResource';
import {SelectCard} from './inputs/SelectCard';
import {Priority} from './deferredActions/DeferredAction';
import {RobotCard} from './cards/promo/SelfReplicatingRobots';
import {SerializedPlayer} from './SerializedPlayer';
import {Timer} from '../common/Timer';
import {AllOptions, DrawOptions} from './deferredActions/DrawCards';
import {Units} from '../common/Units';
import {IStandardProjectCard} from './cards/IStandardProjectCard';
import {GlobalParameter} from '../common/GlobalParameter';
import {GlobalEventName} from '../common/turmoil/globalEvents/GlobalEventName';
import {InputResponse} from '../common/inputs/InputResponse';
import {Tags} from './player/Tags';
import {Colonies} from './player/Colonies';
import {Production} from './player/Production';
import {ICeoCard} from './cards/ceos/ICeoCard';
import {IVictoryPointsBreakdown} from '..//common/game/IVictoryPointsBreakdown';
import {YesAnd} from './cards/requirements/CardRequirement';
import {PlayableCard} from './cards/IProjectCard';
import {Color} from '../common/Color';
import {OrOptions} from './inputs/OrOptions';
import {Stock} from './player/Stock';

export type ResourceSource = IPlayer | GlobalEventName | ICard;

export type CanAffordOptions = Partial<PaymentOptions> & {
  cost: number,
  reserveUnits?: Units,
  tr?: TRSource | DynamicTRSource,
}

/**
 * Behavior when playing a card:
 *   add it to the tableau
 *   discard it from the tableau
 *   only play the card (used for replaying a card)
 *   or do nothing.
 */
export type CardAction ='add' | 'discard' | 'nothing' | 'action-only';

export interface IPlayer {
  readonly id: PlayerId;
  name: string;
  color: Color;
  beginner: boolean;
  handicap: number;

  game: IGame;
  tags: Tags;
  colonies: Colonies;
  readonly production: Production;
  readonly stock: Stock;

  // Corporate identity
  corporations: Array<ICorporationCard>;

  // Used only during set-up
  pickedCorporationCard?: ICorporationCard;

  // Terraforming Rating
  hasIncreasedTerraformRatingThisGeneration: boolean;
  terraformRatingAtGenerationStart: number;

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
  dealtPreludeCards: Array<IProjectCard>;
  dealtCeoCards: Array<ICeoCard>;
  dealtProjectCards: Array<IProjectCard>;
  cardsInHand: Array<IProjectCard>;
  preludeCardsInHand: Array<IProjectCard>;
  ceoCardsInHand: Array<IProjectCard>;
  playedCards: Array<IProjectCard>;
  draftedCards: Array<IProjectCard>;
  draftedCorporations: Array<ICorporationCard>;
  cardCost: number;
  needsToDraft?: boolean;

  timer: Timer;

  // Turmoil
  turmoilPolicyActionUsed: boolean;
  politicalAgendasActionUsedCount: number;

  oceanBonus: number;

  // Custom cards
  // Community Leavitt Station and Pathfinders Leavitt Station
  scienceTagCount: number;
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

  // The number of actions a player can take this round.
  // It's almost always 2, but certain cards can change this value.
  //
  // This value isn't serialized. Probably ought to.
  availableActionsThisRound: number;

  // Stats
  actionsTakenThisGame: number;
  victoryPointsByGeneration: Array<number>;
  totalDelegatesPlaced: number;

  tearDown(): void;
  tableau: Array<ICorporationCard | IProjectCard>;

  isCorporation(corporationName: CardName): boolean;
  getCorporation(corporationName: CardName): ICorporationCard | undefined;
  getCeo(ceoName: CardName): ICeoCard | undefined;
  getCorporationOrThrow(corporationName: CardName): ICorporationCard;
  getTitaniumValue(): number;
  increaseTitaniumValue(): void;
  decreaseTitaniumValue(): void;
  getSelfReplicatingRobotsTargetCards(): Array<RobotCard>;
  getSteelValue(): number;
  increaseSteelValue(): void;
  decreaseSteelValue(): void;
  getTerraformRating(): number;
  increaseTerraformRating(steps?: number, opts?: {log?: boolean}): void;
  decreaseTerraformRating(steps?: number, opts?: {log?: boolean}): void;
  setTerraformRating(value: number): void;
  logUnitDelta(resource: Resource, amount: number, unitType: 'production' | 'amount', from: ResourceSource | undefined, stealing?: boolean): void;

  getActionsThisGeneration(): Set<CardName>;
  addActionThisGeneration(cardName: CardName): void;
  getVictoryPoints(): IVictoryPointsBreakdown;
  cardIsInEffect(cardName: CardName): boolean;
  hasProtectedHabitats(): boolean;
  plantsAreProtected(): boolean;
  alloysAreProtected(): boolean;
  canReduceAnyProduction(resource: Resource, minQuantity?: number): boolean;
  canHaveProductionReduced(resource: Resource, minQuantity: number, attacker: IPlayer): void;
  productionIsProtected(attacker: IPlayer): boolean;
  resolveInsurance(): void;
  resolveInsuranceInSoloGame(): void;
  getColoniesCount(): number;
  getPlayedEventsCount(): number;
  getRequirementsBonus(parameter: GlobalParameter): number;
  removeResourceFrom(card: ICard, count?: number, options?: {removingPlayer? : IPlayer, log?: boolean}): void;
  addResourceTo(card: ICard, options?: number | {qty?: number, log: boolean, logZero?: boolean}): void;

  /**
   * Returns the set of played cards that have actual resources on them.
   *
   * If `resource` is absent, include cards that collect any resource.
   */
  getCardsWithResources(resource?: CardResource): Array<ICard>;

  /**
   * Return the cards that collect `resource`.
   *
   * If `resource` is absent, return the cards that collect any resource.
   */
  getResourceCards(resource?: CardResource): Array<ICard>;

  /**
   * Count all the resources of a given type in the tableau.
   */
  getResourceCount(resource: CardResource): number;
  deferInputCb(result: PlayerInput | undefined): void;
  runInput(input: InputResponse, pi: PlayerInput): void;
  getAvailableBlueActionCount(): number;
  getPlayableActionCards(): Array<ICard & IActionCard>;
  getUsableOPGCeoCards(): Array<ICeoCard>;
  runProductionPhase(): void;
  finishProductionPhase(): void;
  worldGovernmentTerraforming(): void;
  dealForDraft(quantity: number, cards: Array<IProjectCard>): void;
  askPlayerToDraft(initialDraft: boolean, playerName: string, passedCards?: Array<IProjectCard>): void;
  runResearchPhase(draftVariant: boolean): void;
  getCardCost(card: IProjectCard): number;

  /** The number of resources on this card for this player, or 0 if the player does not have this card. */
  resourcesOnCard(name: CardName): number;
  spendableMegacredits(): number;
  getSpendableMicrobes(): number;
  getSpendableFloaters(): number;
  getSpendableLunaArchiveScienceResources(): number;
  getSpendableSeedResources(): number;
  getSpendableData(): number;
  getSpendableGraphene(): number;
  getSpendableKuiperAsteroids(): number;
  getSpendableSpireScienceResources(): number;
  checkPaymentAndPlayCard(selectedCard: IProjectCard, payment: Payment, cardAction?: CardAction): void;
  pay(payment: Payment): void;
  availableHeat(): number;
  spendHeat(amount: number, cb?: () => (undefined | PlayerInput)) : PlayerInput | undefined;

  playCard(selectedCard: IProjectCard, payment?: Payment, cardAction?: CardAction): undefined;
  onCardPlayed(card: IProjectCard): void;
  playAdditionalCorporationCard(corporationCard: ICorporationCard): void;
  playCorporationCard(corporationCard: ICorporationCard): void;
  drawCard(count?: number, options?: DrawOptions): void;
  drawCardKeepSome(count: number, options: AllOptions): void;
  discardPlayedCard(card: IProjectCard): void;
  discardCardFromHand(card: IProjectCard, options?: {log?: boolean}): void;

  /** Player is done taking actions this generation. */
  pass(): void;
  takeActionForFinalGreenery(): void;
  getPlayableCards(): Array<PlayableCard>;
  canPlay(card: IProjectCard): boolean | YesAnd;
  simpleCanPlay(card: IProjectCard, canAffordOptions?: CanAffordOptions): boolean | YesAnd;
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
  runInitialAction(corp: ICorporationCard): void;
  getActions(): OrOptions;
  process(input: InputResponse): void;
  getWaitingFor(): PlayerInput | undefined;
  setWaitingFor(input: PlayerInput, cb?: () => void): void;
  setWaitingForSafely(input: PlayerInput, cb?: () => void): void;
  serialize(): SerializedPlayer;
  defer(input: PlayerInput | undefined, priority?: Priority): void;
}

export function isIPlayer(object: any): object is IPlayer {
  return object !== undefined && object.hasOwnProperty('id') && isPlayerId(object.id) && isIGame(object.game);
}
