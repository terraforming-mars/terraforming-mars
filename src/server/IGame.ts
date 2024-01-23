import {MarsBoard} from './boards/MarsBoard';
import {CardName} from '../common/cards/CardName';
import {CardType} from '../common/cards/CardType';
import {ClaimedMilestone} from './milestones/ClaimedMilestone';
import {IColony} from './colonies/IColony';
import {Color} from '../common/Color';
import {FundedAward} from './awards/FundedAward';
import {IAward} from './awards/IAward';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {Space} from './boards/Space';
import {LogMessageBuilder} from './logs/LogMessageBuilder';
import {LogMessage} from '../common/logs/LogMessage';
import {Phase} from '../common/Phase';
import {IPlayer} from './IPlayer';
import {PlayerId, GameId, SpectatorId, SpaceId, isGameId} from '../common/Types';
import {CardResource} from '../common/CardResource';
import {AndThen, DeferredAction, Priority} from './deferredActions/DeferredAction';
import {DeferredActionsQueue} from './deferredActions/DeferredActionsQueue';
import {SerializedGame} from './SerializedGame';
import {SpaceBonus} from '../common/boards/SpaceBonus';
import {TileType} from '../common/TileType';
import {Turmoil} from './turmoil/Turmoil';
import {AresData} from '../common/ares/AresData';
import {MoonData} from './moon/MoonData';
import {SeededRandom} from '../common/utils/Random';
import {PathfindersData} from './pathfinders/PathfindersData';
import {GameOptions} from './game/GameOptions';
import {CorporationDeck, PreludeDeck, ProjectDeck, CeoDeck} from './cards/Deck';
import {Tag} from '../common/cards/Tag';
import {Tile} from './Tile';
import {Logger} from './logs/Logger';
import {GlobalParameter} from '../common/GlobalParameter';
import {UnderworldData} from './underworld/UnderworldData';

export interface Score {
  corporation: String;
  playerScore: number;
}
export interface IGame extends Logger {
  readonly id: GameId;
  readonly gameOptions: Readonly<GameOptions>;
  // Game-level data
  lastSaveId: number;
  rng: SeededRandom;
  spectatorId: SpectatorId | undefined;
  deferredActions: DeferredActionsQueue;
  createdTime: Date;
  gameAge: number; // Each log event increases it
  gameLog: Array<LogMessage>;
  undoCount: number; // Each undo increases it
  inputsThisRound: number;
  resettable: boolean;
  generation: number;
  globalsPerGeneration: Array<Partial<Record<GlobalParameter, number>>>;
  phase: Phase;
  projectDeck: ProjectDeck;
  preludeDeck: PreludeDeck;
  ceoDeck: CeoDeck;
  corporationDeck: CorporationDeck;
  board: MarsBoard;
  activePlayer: PlayerId;
  claimedMilestones: Array<ClaimedMilestone>;
  milestones: Array<IMilestone>;
  fundedAwards: Array<FundedAward>;
  awards: Array<IAward>;
  // Expansion-specific data
  colonies: Array<IColony>;
  discardedColonies: Array<IColony>; // Not serialized
  turmoil: Turmoil | undefined;
  aresData: AresData | undefined;
  moonData: MoonData | undefined;
  pathfindersData: PathfindersData | undefined;
  underworldData: UnderworldData | undefined;

  // Card-specific data
  // Mons Insurance promo corp
  monsInsuranceOwner?: PlayerId; // Not serialized
  // Crash Site promo project
  someoneHasRemovedOtherPlayersPlants: boolean;
  // Syndicate Pirate Raids
  syndicatePirateRaider?: PlayerId;
  // Gagarin Mobile Base
  gagarinBase: Array<SpaceId>;
  // St. Joseph of Cupertino Mission
  stJosephCathedrals: Array<SpaceId>;
  // Mars Nomads
  nomadSpace: SpaceId | undefined;
  // Trade Embargo
  tradeEmbargo: boolean;
  // Behold The Emperor
  beholdTheEmperor: boolean;

  // The set of tags available in this game.
  readonly tags: ReadonlyArray<Tag>;
  // Function use to properly start the game: with project draft or with research phase
  gotoInitialPhase(): void;
  save(): void;
  toJSON(): string;
  serialize(): SerializedGame;
  isSoloMode() :boolean;
  // Retrieve a player by it's id
  getPlayerById(id: PlayerId): IPlayer;
  // Return an array of players from an array of player ids
  getPlayersById(ids: Array<PlayerId>): Array<IPlayer>;
  defer<T>(action: DeferredAction<T>, priority?: Priority): AndThen<T>;
  milestoneClaimed(milestone: IMilestone): boolean;
  marsIsTerraformed(): boolean;
  lastSoloGeneration(): number;
  isSoloModeWin(): boolean;
  getAwardFundingCost(): number;
  fundAward(player: IPlayer, award: IAward): void;
  hasBeenFunded(award: IAward): boolean;
  allAwardsFunded(): boolean;
  allMilestonesClaimed(): boolean;
  hasPassedThisActionPhase(player: IPlayer): boolean;
  // Public for testing.
  incrementFirstPlayer(): void;
  // Only used in the prelude The New Space Race
  overrideFirstPlayer(newFirstPlayer: IPlayer): void;
  // The first player this generation
  readonly first: IPlayer;
  gameIsOver(): boolean;
  isDoneWithFinalProduction(): boolean;
  doneWorldGovernmentTerraforming(): void;
  playerHasPassed(player: IPlayer): void;
  hasResearched(player: IPlayer): boolean;
  playerIsFinishedWithResearchPhase(player: IPlayer): void;
  playerIsFinishedWithDraftingPhase(initialDraft: boolean, player: IPlayer, cards : Array<IProjectCard>): void;
  playerIsFinishedTakingActions(): void;
  // Part of final greenery placement.
  canPlaceGreenery(player: IPlayer): boolean;
  // Called when a player cannot or chose not to place any more greeneries.
  playerIsDoneWithGame(player: IPlayer): void;
  /**
   * Find the next player who might be able to place a final greenery and ask them.
   *
   * If nobody can add a greenery, end the game.
   */
  /* for testing */ takeNextFinalGreeneryAction(): void;
  increaseOxygenLevel(player: IPlayer, increments: -2 | -1 | 1 | 2): void;
  getOxygenLevel(): number;
  increaseVenusScaleLevel(player: IPlayer, increments: -1 | 1 | 2 | 3): number;
  getVenusScaleLevel(): number;
  increaseTemperature(player: IPlayer, increments: -2 | -1 | 1 | 2 | 3): undefined;
  getTemperature(): number;
  getGeneration(): number;
  getPassedPlayers():Array<Color>;
  // addTile applies to the Mars board, but not the Moon board, see MoonExpansion.addTile for placing
  // a tile on The Moon.
  addTile(player: IPlayer, space: Space, tile: Tile): void;
  simpleAddTile(player: IPlayer, space: Space, tile: Tile): void;
  grantSpaceBonuses(player: IPlayer, space: Space): void;
  grantSpaceBonus(player: IPlayer, spaceBonus: SpaceBonus, count?: number): void;
  addGreenery(player: IPlayer, space: Space, shouldRaiseOxygen?: boolean): void;
  addCity(player: IPlayer, space: Space, cardName?: CardName | undefined): void;
  canAddOcean(): boolean;
  canRemoveOcean(): boolean;
  addOcean(player: IPlayer, space: Space): void;
  removeTile(spaceId: string): void;
  getPlayers(): ReadonlyArray<IPlayer>;
  // Players returned in play order starting with first player this generation.
  getPlayersInGenerationOrder(): ReadonlyArray<IPlayer>;
  /**
   * Returns the Player holding this card, or throws.
   */
  getCardPlayerOrThrow(name: CardName): IPlayer;
  /**
   * Returns the Player holding this card, or returns undefined.
   */
  getCardPlayerOrUndefined(name: CardName): IPlayer | undefined;
  // Returns the player holding a card in hand. Return undefined when nobody has that card in hand.
  getCardHolder(name: CardName): [IPlayer | undefined, IProjectCard | undefined];
  getCardsInHandByResource(player: IPlayer, resourceType: CardResource): void;
  getCardsInHandByType(player: IPlayer, cardType: CardType): void;
  log(message: string, f?: (builder: LogMessageBuilder) => void, options?: {reservedFor?: IPlayer}): void;
  discardForCost(cardCount: 1 | 2, toPlace: TileType): number;
  getSpaceByOffset(direction: -1 | 1, toPlace: TileType, cardCount?: 1 | 2): Space;
  expectedPurgeTimeMs(): number;
  logIllegalState(description: string, metadata: {}): void;
}

export function isIGame(object: any): object is IGame {
  return object !== undefined && object.hasOwnProperty('id') && isGameId(object.id);
}
