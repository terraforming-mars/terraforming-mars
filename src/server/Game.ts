import * as constants from '../common/constants';
import {BeginnerCorporation} from './cards/corporation/BeginnerCorporation';
import {Board} from './boards/Board';
import {cardsFromJSON} from './createCard';
import {CardName} from '../common/cards/CardName';
import {CardType} from '../common/cards/CardType';
import {ClaimedMilestone, serializeClaimedMilestones, deserializeClaimedMilestones} from './milestones/ClaimedMilestone';
import {ColonyDealer} from './colonies/ColonyDealer';
import {IColony} from './colonies/IColony';
import {Color} from '../common/Color';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {Database} from './database/Database';
import {FundedAward, serializeFundedAwards, deserializeFundedAwards} from './awards/FundedAward';
import {IAward} from './awards/IAward';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {Space} from './boards/Space';
import {Tile} from './Tile';
import {LogMessageBuilder} from './logs/LogMessageBuilder';
import {LogHelper} from './LogHelper';
import {LogMessage} from '../common/logs/LogMessage';
import {ALL_MILESTONES} from './milestones/Milestones';
import {ALL_AWARDS} from './awards/Awards';
import {PartyHooks} from './turmoil/parties/PartyHooks';
import {Phase} from '../common/Phase';
import {IPlayer} from './IPlayer';
import {Player} from './Player';
import {PlayerId, GameId, SpectatorId, SpaceId} from '../common/Types';
import {PlayerInput} from './PlayerInput';
import {CardResource} from '../common/CardResource';
import {Resource} from '../common/Resource';
import {AndThen, DeferredAction} from './deferredActions/DeferredAction';
import {Priority} from './deferredActions/Priority';
import {DeferredActionsQueue} from './deferredActions/DeferredActionsQueue';
import {SelectPaymentDeferred} from './deferredActions/SelectPaymentDeferred';
import {SelectInitialCards} from './inputs/SelectInitialCards';
import {PlaceOceanTile} from './deferredActions/PlaceOceanTile';
import {RemoveColonyFromGame} from './deferredActions/RemoveColonyFromGame';
import {GainResources} from './deferredActions/GainResources';
import {SerializedGame} from './SerializedGame';
import {SpaceBonus} from '../common/boards/SpaceBonus';
import {TileType} from '../common/TileType';
import {Turmoil} from './turmoil/Turmoil';
import {RandomMAOptionType} from '../common/ma/RandomMAOptionType';
import {AresHandler} from './ares/AresHandler';
import {AresData} from '../common/ares/AresData';
import {GameSetup} from './GameSetup';
import {GameCards} from './GameCards';
import {GlobalParameter} from '../common/GlobalParameter';
import {AresSetup} from './ares/AresSetup';
import {MoonData} from './moon/MoonData';
import {MoonExpansion} from './moon/MoonExpansion';
import {TurmoilHandler} from './turmoil/TurmoilHandler';
import {SeededRandom} from '../common/utils/Random';
import {chooseMilestonesAndAwards} from './ma/MilestoneAwardSelector';
import {BoardType} from './boards/BoardType';
import {MultiSet} from 'mnemonist';
import {GrantVenusAltTrackBonusDeferred} from './venusNext/GrantVenusAltTrackBonusDeferred';
import {PathfindersExpansion} from './pathfinders/PathfindersExpansion';
import {PathfindersData} from './pathfinders/PathfindersData';
import {AddResourcesToCard} from './deferredActions/AddResourcesToCard';
import {ColonyDeserializer} from './colonies/ColonyDeserializer';
import {GameLoader} from './database/GameLoader';
import {DEFAULT_GAME_OPTIONS, GameOptions} from './game/GameOptions';
import {TheNewSpaceRace} from './cards/pathfinders/TheNewSpaceRace';
import {CorporationDeck, PreludeDeck, ProjectDeck, CeoDeck} from './cards/Deck';
import {Logger} from './logs/Logger';
import {addDays, dayStringToDays} from './database/utils';
import {ALL_TAGS, Tag} from '../common/cards/Tag';
import {IGame, Score} from './IGame';
import {MarsBoard} from './boards/MarsBoard';
import {UnderworldData} from './underworld/UnderworldData';
import {UnderworldExpansion} from './underworld/UnderworldExpansion';
import {SpaceType} from '../common/boards/SpaceType';

export class Game implements IGame, Logger {
  public readonly id: GameId;
  public readonly gameOptions: Readonly<GameOptions>;
  private players: Array<IPlayer>;

  // Game-level data
  public lastSaveId: number = 0;
  private clonedGamedId: string | undefined;
  public rng: SeededRandom;
  public spectatorId: SpectatorId | undefined;
  public deferredActions: DeferredActionsQueue = new DeferredActionsQueue();
  public createdTime: Date = new Date(0);
  public gameAge: number = 0; // Each log event increases it
  public gameLog: Array<LogMessage> = [];
  public undoCount: number = 0; // Each undo increases it
  public inputsThisRound = 0;
  public resettable: boolean = false;
  public globalsPerGeneration: Array<Partial<Record<GlobalParameter, number>>> = [];

  public generation: number = 1;
  public phase: Phase = Phase.RESEARCH;
  public projectDeck: ProjectDeck;
  public preludeDeck: PreludeDeck;
  public ceoDeck: CeoDeck;
  public corporationDeck: CorporationDeck;
  public board: MarsBoard;

  // Global parameters
  private oxygenLevel: number = constants.MIN_OXYGEN_LEVEL;
  private temperature: number = constants.MIN_TEMPERATURE;
  private venusScaleLevel: number = constants.MIN_VENUS_SCALE;

  // Player data
  public activePlayer: PlayerId;
  private donePlayers = new Set<PlayerId>();
  private passedPlayers = new Set<PlayerId>();
  private researchedPlayers = new Set<PlayerId>();
  private draftedPlayers = new Set<PlayerId>();
  // The first player of this generation.
  public first: IPlayer;

  // Drafting
  private draftRound: number = 1;
  // Used when drafting the first 10 project cards.
  private initialDraftIteration: number = 1;
  private unDraftedCards: Map<PlayerId, Array<IProjectCard>> = new Map();

  // Milestones and awards
  public claimedMilestones: Array<ClaimedMilestone> = [];
  public milestones: Array<IMilestone> = [];
  public fundedAwards: Array<FundedAward> = [];
  public awards: Array<IAward> = [];

  // Expansion-specific data
  public colonies: Array<IColony> = [];
  public discardedColonies: Array<IColony> = []; // Not serialized
  public turmoil: Turmoil | undefined;
  public aresData: AresData | undefined;
  public moonData: MoonData | undefined;
  public pathfindersData: PathfindersData | undefined;
  public underworldData: UnderworldData = UnderworldExpansion.initializeGameWithoutUnderworld();

  // Card-specific data
  // Mons Insurance promo corp
  public monsInsuranceOwner?: PlayerId; // Not serialized
  // Crash Site promo project
  public someoneHasRemovedOtherPlayersPlants: boolean = false;
  // Syndicate Pirate Raids
  public syndicatePirateRaider?: PlayerId;
  // Gagarin Mobile Base
  public gagarinBase: Array<SpaceId> = [];
  // St. Joseph of Cupertino Mission
  stJosephCathedrals: Array<SpaceId> = [];
  // Mars Nomads
  nomadSpace: SpaceId | undefined = undefined;
  // Trade Embargo
  public tradeEmbargo: boolean = false;
  // Behold The Emperor
  public beholdTheEmperor: boolean = false;

  // The set of tags available in this game.
  public readonly tags: ReadonlyArray<Tag>;

  private constructor(
    id: GameId,
    players: Array<IPlayer>,
    first: IPlayer,
    activePlayer: PlayerId,
    gameOptions: GameOptions,
    rng: SeededRandom,
    board: MarsBoard,
    projectDeck: ProjectDeck,
    corporationDeck: CorporationDeck,
    preludeDeck: PreludeDeck,
    ceoDeck: CeoDeck) {
    this.id = id;
    this.gameOptions = {...gameOptions};
    this.players = players;
    const playerIds = players.map((p) => p.id);
    if (playerIds.includes(first.id) === false) {
      throw new Error('Cannot find first player ' + first.id + ' in ' + playerIds);
    }
    if (playerIds.includes(activePlayer) === false) {
      throw new Error('Cannot find active player ' + activePlayer + ' in ' + playerIds);
    }
    if (new Set(playerIds).size !== players.length) {
      throw new Error('Duplicate player found: ' + playerIds);
    }
    const colors = players.map((p) => p.color);
    if (new Set(colors).size !== players.length) {
      throw new Error('Duplicate color found: ' + colors);
    }

    this.activePlayer = activePlayer;
    this.first = first;
    this.rng = rng;
    this.projectDeck = projectDeck;
    this.corporationDeck = corporationDeck;
    this.preludeDeck = preludeDeck;
    this.ceoDeck = ceoDeck;
    this.board = board;

    this.players.forEach((player) => {
      player.game = this;
      if (player.isCorporation(CardName.MONS_INSURANCE)) this.monsInsuranceOwner = player.id;
    });

    this.tags = ALL_TAGS.filter((tag) => {
      if (tag === Tag.VENUS) return gameOptions.venusNextExtension;
      if (tag === Tag.MOON) return gameOptions.moonExpansion;
      if (tag === Tag.MARS) return gameOptions.pathfindersExpansion;
      if (tag === Tag.CLONE) return gameOptions.pathfindersExpansion;
      return true;
    });
  }

  public static newInstance(id: GameId,
    players: Array<IPlayer>,
    firstPlayer: IPlayer,
    options: Partial<GameOptions> = {},
    seed = 0,
    spectatorId: SpectatorId | undefined = undefined): Game {
    const gameOptions = {...DEFAULT_GAME_OPTIONS, ...options};
    if (gameOptions.clonedGamedId !== undefined) {
      throw new Error('Cloning should not come through this execution path.');
    }
    const rng = new SeededRandom(seed);
    const board = GameSetup.newBoard(gameOptions, rng);
    const gameCards = new GameCards(gameOptions);

    const projectDeck = new ProjectDeck(gameCards.getProjectCards(), [], rng);
    projectDeck.shuffle();

    const corporationDeck = new CorporationDeck(gameCards.getCorporationCards(), [], rng);
    corporationDeck.shuffle(gameOptions.customCorporationsList);

    const preludeDeck = new PreludeDeck(gameCards.getPreludeCards(), [], rng);
    preludeDeck.shuffle(gameOptions.customPreludes);

    const ceoDeck = new CeoDeck(gameCards.getCeoCards(), [], rng);
    ceoDeck.shuffle(gameOptions.customCeos);

    const activePlayer = firstPlayer.id;

    // Single player game player starts with 14TR
    if (players.length === 1) {
      gameOptions.draftVariant = false;
      gameOptions.initialDraftVariant = false;
      gameOptions.randomMA = RandomMAOptionType.NONE;

      players[0].setTerraformRating(14);
    }

    const game = new Game(id, players, firstPlayer, activePlayer, gameOptions, rng, board, projectDeck, corporationDeck, preludeDeck, ceoDeck);
    game.spectatorId = spectatorId;
    // This evaluation of created time doesn't match what's stored in the database, but that's fine.
    game.createdTime = new Date();
    // Initialize Ares data
    if (gameOptions.aresExtension) {
      game.aresData = AresSetup.initialData(gameOptions.aresHazards, players);
    }

    const milestonesAwards = chooseMilestonesAndAwards(gameOptions);
    game.milestones = milestonesAwards.milestones;
    game.awards = milestonesAwards.awards;

    // Add colonies stuff
    if (gameOptions.coloniesExtension) {
      const colonyDealer = new ColonyDealer(rng, gameOptions);
      colonyDealer.drawColonies(players.length);
      game.colonies = colonyDealer.colonies;
      game.discardedColonies = colonyDealer.discardedColonies;
    }

    // Add Turmoil stuff
    if (gameOptions.turmoilExtension) {
      game.turmoil = Turmoil.newInstance(game, gameOptions.politicalAgendasExtension);
    }

    // Must configure this before solo placement.
    if (gameOptions.underworldExpansion) {
      game.underworldData = UnderworldExpansion.initialize(rng);
    }

    // and 2 neutral cities and forests on board
    if (players.length === 1) {
      //  Setup solo player's starting tiles
      GameSetup.setupNeutralPlayer(game);
    }

    // Setup Ares hazards
    if (gameOptions.aresExtension && gameOptions.aresHazards) {
      AresSetup.setupHazards(game, players.length);
    }

    if (gameOptions.moonExpansion) {
      game.moonData = MoonExpansion.initialize();
    }

    if (gameOptions.pathfindersExpansion) {
      game.pathfindersData = PathfindersExpansion.initialize(gameOptions);
    }

    // Failsafe for exceeding corporation pool
    // (I do not think this is necessary any further given how corporation cards are stored now)
    const minCorpsRequired = players.length * gameOptions.startingCorporations;
    if (minCorpsRequired > corporationDeck.drawPile.length) {
      gameOptions.startingCorporations = 2;
    }

    // Initialize each player:
    // Give them their corporation cards, other cards, starting production,
    // handicaps.
    for (const player of game.getPlayersInGenerationOrder()) {
      player.setTerraformRating(player.getTerraformRating() + player.handicap);
      if (!gameOptions.corporateEra) {
        player.production.override({
          megacredits: 1,
          steel: 1,
          titanium: 1,
          plants: 1,
          energy: 1,
          heat: 1,
        });
      }

      if (!player.beginner ||
        // Bypass beginner choice if any extension is choosen
        gameOptions.ceoExtension ||
        gameOptions.preludeExtension ||
        gameOptions.venusNextExtension ||
        gameOptions.coloniesExtension ||
        gameOptions.turmoilExtension ||
        gameOptions.initialDraftVariant ||
        gameOptions.ceoExtension) {
        player.dealtCorporationCards.push(...corporationDeck.drawN(game, gameOptions.startingCorporations));
        if (gameOptions.initialDraftVariant === false) {
          player.dealtProjectCards.push(...projectDeck.drawN(game, 10));
        }
        if (gameOptions.preludeExtension) {
          player.dealtPreludeCards.push(...preludeDeck.drawN(game, constants.PRELUDE_CARDS_DEALT_PER_PLAYER));
        }
        if (gameOptions.ceoExtension) {
          player.dealtCeoCards.push(...ceoDeck.drawN(game, gameOptions.startingCeos));
        }
      } else {
        game.playerHasPickedCorporationCard(player, new BeginnerCorporation());
      }
    }

    // Print game_id if solo game
    if (players.length === 1) {
      game.log('The id of this game is ${0}', (b) => b.rawString(id));
    }

    players.forEach((player) => {
      game.log('Good luck ${0}!', (b) => b.player(player), {reservedFor: player});
    });

    game.log('Generation ${0}', (b) => b.forNewGeneration().number(game.generation));

    game.gotoInitialPhase();

    return game;
  }

  // Function use to properly start the game: with project draft or with research phase
  public gotoInitialPhase(): void {
    // Initial Draft
    if (this.gameOptions.initialDraftVariant) {
      this.phase = Phase.INITIALDRAFTING;
      this.runDraftRound(true, false);
    } else {
      this.gotoInitialResearchPhase();
    }
  }

  public save(): void {
    GameLoader.getInstance().saveGame(this);
  }

  public toJSON(): string {
    return JSON.stringify(this.serialize());
  }

  public serialize(): SerializedGame {
    const result: SerializedGame = {
      activePlayer: this.activePlayer,
      awards: this.awards.map((a) => a.name),
      beholdTheEmperor: this.beholdTheEmperor,
      board: this.board.serialize(),
      claimedMilestones: serializeClaimedMilestones(this.claimedMilestones),
      ceoDeck: this.ceoDeck.serialize(),
      colonies: this.colonies.map((colony) => colony.serialize()),
      corporationDeck: this.corporationDeck.serialize(),
      createdTimeMs: this.createdTime.getTime(),
      currentSeed: this.rng.current,
      deferredActions: [],
      donePlayers: Array.from(this.donePlayers),
      draftedPlayers: Array.from(this.draftedPlayers),
      draftRound: this.draftRound,
      first: this.first.id,
      fundedAwards: serializeFundedAwards(this.fundedAwards),
      gagarinBase: this.gagarinBase,
      stJosephCathedrals: this.stJosephCathedrals,
      nomadSpace: this.nomadSpace,
      gameAge: this.gameAge,
      gameLog: this.gameLog,
      gameOptions: this.gameOptions,
      generation: this.generation,
      globalsPerGeneration: this.globalsPerGeneration,
      id: this.id,
      initialDraftIteration: this.initialDraftIteration,
      lastSaveId: this.lastSaveId,
      milestones: this.milestones.map((m) => m.name),
      moonData: MoonData.serialize(this.moonData),
      oxygenLevel: this.oxygenLevel,
      passedPlayers: Array.from(this.passedPlayers),
      pathfindersData: PathfindersData.serialize(this.pathfindersData),
      phase: this.phase,
      players: this.players.map((p) => p.serialize()),
      preludeDeck: this.preludeDeck.serialize(),
      projectDeck: this.projectDeck.serialize(),
      researchedPlayers: Array.from(this.researchedPlayers),
      seed: this.rng.seed,
      someoneHasRemovedOtherPlayersPlants: this.someoneHasRemovedOtherPlayersPlants,
      spectatorId: this.spectatorId,
      syndicatePirateRaider: this.syndicatePirateRaider,
      temperature: this.temperature,
      tradeEmbargo: this.tradeEmbargo,
      underworldData: this.underworldData,
      undoCount: this.undoCount,
      unDraftedCards: Array.from(this.unDraftedCards.entries()).map((a) => {
        return [
          a[0],
          a[1].map((c) => c.name),
        ];
      }),
      venusScaleLevel: this.venusScaleLevel,
    };
    if (this.aresData !== undefined) {
      result.aresData = this.aresData;
    }
    if (this.clonedGamedId !== undefined) {
      result.clonedGamedId = this.clonedGamedId;
    }
    if (this.turmoil !== undefined) {
      result.turmoil = this.turmoil.serialize();
    }
    return result;
  }

  public isSoloMode() :boolean {
    return this.players.length === 1;
  }

  // Function to retrieve a player by it's id
  public getPlayerById(id: PlayerId): IPlayer {
    const player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      throw new Error(`player ${id} does not exist on game ${this.id}`);
    }
    return player;
  }

  // Function to return an array of players from an array of player ids
  public getPlayersById(ids: Array<PlayerId>): Array<IPlayer> {
    return ids.map((id) => this.getPlayerById(id));
  }

  public defer<T>(action: DeferredAction<T>, priority?: Priority): AndThen<T> {
    if (priority !== undefined) {
      action.priority = priority;
    }
    this.deferredActions.push(action);
    return action;
  }

  public milestoneClaimed(milestone: IMilestone): boolean {
    return this.claimedMilestones.some(
      (claimedMilestone) => claimedMilestone.milestone.name === milestone.name,
    );
  }

  public marsIsTerraformed(): boolean {
    const oxygenMaxed = this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL;
    const temperatureMaxed = this.temperature >= constants.MAX_TEMPERATURE;
    const oceansMaxed = !this.canAddOcean();
    let globalParametersMaxed = oxygenMaxed && temperatureMaxed && oceansMaxed;
    const venusMaxed = this.getVenusScaleLevel() === constants.MAX_VENUS_SCALE;

    MoonExpansion.ifMoon(this, (moonData) => {
      if (this.gameOptions.requiresMoonTrackCompletion) {
        const moonMaxed =
          moonData.habitatRate === constants.MAXIMUM_HABITAT_RATE &&
          moonData.miningRate === constants.MAXIMUM_MINING_RATE &&
          moonData.logisticRate === constants.MAXIMUM_LOGISTICS_RATE;
        globalParametersMaxed = globalParametersMaxed && moonMaxed;
      }
    });

    // Solo games with Venus needs Venus maxed to end the game.
    if (this.players.length === 1 && this.gameOptions.venusNextExtension) {
      return globalParametersMaxed && venusMaxed;
    }
    // new option "requiresVenusTrackCompletion" also makes maximizing Venus a game-end requirement
    if (this.gameOptions.venusNextExtension && this.gameOptions.requiresVenusTrackCompletion) {
      return globalParametersMaxed && venusMaxed;
    }
    return globalParametersMaxed;
  }

  public lastSoloGeneration(): number {
    let lastGeneration = 14;
    const options = this.gameOptions;
    if (options.preludeExtension) {
      lastGeneration -= 2;
    }

    // Only add 2 more generations when using the track completion option
    // and not the solo TR option.
    //
    // isSoloModeWin backs this up.
    if (options.moonExpansion) {
      if (!options.soloTR && options.requiresMoonTrackCompletion) {
        lastGeneration += 2;
      }
    }
    return lastGeneration;
  }

  public isSoloModeWin(): boolean {
    // Solo TR victory condition
    if (this.gameOptions.soloTR) {
      return this.players[0].getTerraformRating() >= 63;
    }

    // Complete terraforing victory condition.
    if (!this.marsIsTerraformed()) {
      return false;
    }

    // This last conditional doesn't make much sense to me. It's only ever really used
    // on the client at components/GameEnd.ts. Which is probably why it doesn't make
    // obvious sense why when this generation is earlier than the last generation
    // of the game means "true, is solo mode win."
    return this.generation <= this.lastSoloGeneration();
  }

  public getAwardFundingCost(): number {
    return 8 + (6 * this.fundedAwards.length);
  }

  public fundAward(player: IPlayer, award: IAward): void {
    if (this.allAwardsFunded()) {
      throw new Error('All awards already funded');
    }
    this.log('${0} funded ${1} award',
      (b) => b.player(player).award(award));

    if (this.hasBeenFunded(award)) {
      throw new Error(award.name + ' cannot is already funded.');
    }
    this.fundedAwards.push({
      award: award,
      player: player,
    });
  }

  public hasBeenFunded(award: IAward): boolean {
    return this.fundedAwards.some(
      (fundedAward) => fundedAward.award.name === award.name,
    );
  }

  public allAwardsFunded(): boolean {
    // Awards are disabled for 1 player games
    if (this.players.length === 1) return true;

    return this.fundedAwards.length >= constants.MAX_AWARDS;
  }

  public allMilestonesClaimed(): boolean {
    // Milestones are disabled for 1 player games
    if (this.players.length === 1) return true;

    return this.claimedMilestones.length >= constants.MAX_MILESTONES;
  }

  private playerHasPickedCorporationCard(player: IPlayer, corporationCard: ICorporationCard): void {
    player.pickedCorporationCard = corporationCard;
    if (this.players.every((p) => p.pickedCorporationCard !== undefined)) {
      for (const somePlayer of this.getPlayersInGenerationOrder()) {
        if (somePlayer.pickedCorporationCard === undefined) {
          throw new Error(`pickedCorporationCard is not defined for ${somePlayer.id}`);
        }
        somePlayer.playCorporationCard(somePlayer.pickedCorporationCard);
      }
    }
  }

  private selectInitialCards(player: IPlayer): PlayerInput {
    return new SelectInitialCards(player, (corporation: ICorporationCard) => {
      this.playerHasPickedCorporationCard(player, corporation);
      return undefined;
    });
  }

  public hasPassedThisActionPhase(player: IPlayer): boolean {
    return this.passedPlayers.has(player.id);
  }

  // Public for testing.
  public incrementFirstPlayer(): void {
    let firstIndex = this.players.map((x) => x.id).indexOf(this.first.id);
    if (firstIndex === -1) {
      throw new Error('Didn\'t even find player');
    }
    firstIndex = (firstIndex + 1) % this.players.length;
    this.first = this.players[firstIndex];
  }

  // Only used in the prelude The New Space Race.
  public overrideFirstPlayer(newFirstPlayer: IPlayer): void {
    if (newFirstPlayer.game.id !== this.id) {
      throw new Error(`player ${newFirstPlayer.id} is not part of this game`);
    }
    this.first = newFirstPlayer;
  }

  private runDraftRound(initialDraft: boolean = false, preludeDraft: boolean = false): void {
    this.save();
    this.draftedPlayers.clear();
    this.players.forEach((player) => {
      player.needsToDraft = true;
      if (this.draftRound === 1 && !preludeDraft) {
        player.askPlayerToDraft(initialDraft, this.giveDraftCardsTo(player));
      } else if (this.draftRound === 1 && preludeDraft) {
        player.askPlayerToDraft(initialDraft, this.giveDraftCardsTo(player), player.dealtPreludeCards);
      } else {
        const draftCardsFrom = this.getDraftCardsFrom(player).id;
        const cards = this.unDraftedCards.get(draftCardsFrom);
        this.unDraftedCards.delete(draftCardsFrom);
        player.askPlayerToDraft(initialDraft, this.giveDraftCardsTo(player), cards);
      }
    });
  }

  private gotoInitialResearchPhase(): void {
    this.phase = Phase.RESEARCH;

    this.save();

    for (const player of this.players) {
      if (player.pickedCorporationCard === undefined && player.dealtCorporationCards.length > 0) {
        player.setWaitingFor(this.selectInitialCards(player));
      }
    }
    if (this.players.length === 1 && this.gameOptions.coloniesExtension) {
      this.players[0].production.add(Resource.MEGACREDITS, -2);
      this.defer(new RemoveColonyFromGame(this.players[0]));
    }
  }

  private gotoResearchPhase(): void {
    this.phase = Phase.RESEARCH;
    this.researchedPlayers.clear();
    this.save();
    this.players.forEach((player) => {
      player.runResearchPhase(this.gameOptions.draftVariant);
    });
  }

  private gotoDraftPhase(): void {
    this.phase = Phase.DRAFTING;
    this.draftRound = 1;
    this.runDraftRound();
  }

  public gameIsOver(): boolean {
    if (this.isSoloMode()) {
      // Solo games continue until the designated generation end even if Mars is already terraformed
      return this.generation === this.lastSoloGeneration();
    }
    return this.marsIsTerraformed();
  }

  public isDoneWithFinalProduction(): boolean {
    return this.phase === Phase.END || (this.gameIsOver() && this.phase === Phase.PRODUCTION);
  }

  private gotoProductionPhase(): void {
    this.phase = Phase.PRODUCTION;
    this.passedPlayers.clear();
    this.someoneHasRemovedOtherPlayersPlants = false;
    this.players.forEach((player) => {
      player.colonies.cardDiscount = 0; // Iapetus reset hook
      player.runProductionPhase();
    });
    this.postProductionPhase();
  }

  private postProductionPhase(): void {
    if (this.deferredActions.length > 0) {
      this.deferredActions.runAll(() => this.postProductionPhase());
      return;
    }
    if (this.gameIsOver()) {
      this.log('Final greenery placement', (b) => b.forNewGeneration());
      this.takeNextFinalGreeneryAction();
      return;
    } else {
      this.players.forEach((player) => {
        player.colonies.returnTradeFleets();
      });
    }

    // solar Phase Option
    this.phase = Phase.SOLAR;
    if (this.gameOptions.solarPhaseOption && ! this.marsIsTerraformed()) {
      this.gotoWorldGovernmentTerraforming();
      return;
    }
    this.gotoEndGeneration();
  }

  private endGenerationForColonies() {
    if (this.gameOptions.coloniesExtension) {
      this.colonies.forEach((colony) => {
        colony.endGeneration(this);
      });
      // Syndicate Pirate Raids hook. Also see Colony.ts and Player.ts
      this.syndicatePirateRaider = undefined;
      // Trade embargo hook.
      this.tradeEmbargo = false;
    }
  }

  private gotoEndGeneration() {
    this.endGenerationForColonies();

    Turmoil.ifTurmoil(this, (turmoil) => {
      turmoil.endGeneration(this);
      // Behold The Emperor hook
      this.beholdTheEmperor = false;
    });

    UnderworldExpansion.endGeneration(this);

    // turmoil.endGeneration might have added actions.
    if (this.deferredActions.length > 0) {
      this.deferredActions.runAll(() => this.startGeneration());
    } else {
      this.startGeneration();
    }
  }

  private updatePlayerVPForTheGeneration(): void {
    this.getPlayers().forEach((player) => {
      player.victoryPointsByGeneration.push(player.getVictoryPoints().total);
    });
  }

  private updateGlobalsForTheGeneration(): void {
    if (!Array.isArray(this.globalsPerGeneration)) {
      this.globalsPerGeneration = [];
    }
    this.globalsPerGeneration.push({});
    const entry = this.globalsPerGeneration[this.globalsPerGeneration.length - 1];
    entry[GlobalParameter.TEMPERATURE] = this.temperature;
    entry[GlobalParameter.OXYGEN] = this.oxygenLevel;
    entry[GlobalParameter.OCEANS] = this.board.getOceanSpaces().length;
    if (this.gameOptions.venusNextExtension) {
      entry[GlobalParameter.VENUS] = this.venusScaleLevel;
    }
    MoonExpansion.ifMoon(this, (moonData) => {
      entry[GlobalParameter.MOON_HABITAT_RATE] = moonData.habitatRate;
      entry[GlobalParameter.MOON_MINING_RATE] = moonData.miningRate;
      entry[GlobalParameter.MOON_LOGISTICS_RATE] = moonData.logisticRate;
    });
  }

  private startGeneration() {
    this.phase = Phase.INTERGENERATION;
    this.updatePlayerVPForTheGeneration();
    this.updateGlobalsForTheGeneration();
    this.generation++;
    this.log('Generation ${0}', (b) => b.forNewGeneration().number(this.generation));
    this.incrementFirstPlayer();

    this.players.forEach((player) => {
      player.hasIncreasedTerraformRatingThisGeneration = false;
    });

    if (this.gameOptions.draftVariant) {
      this.gotoDraftPhase();
    } else {
      this.gotoResearchPhase();
    }
  }

  private gotoWorldGovernmentTerraforming() {
    this.first.worldGovernmentTerraforming();
  }

  public doneWorldGovernmentTerraforming() {
    // Carry on to next phase
    this.gotoEndGeneration();
  }

  private allPlayersHavePassed(): boolean {
    for (const player of this.players) {
      if (!this.hasPassedThisActionPhase(player)) {
        return false;
      }
    }
    return true;
  }

  public playerHasPassed(player: IPlayer): void {
    this.passedPlayers.add(player.id);
  }

  public hasResearched(player: IPlayer): boolean {
    return this.researchedPlayers.has(player.id);
  }

  private hasDrafted(player: IPlayer): boolean {
    return this.draftedPlayers.has(player.id);
  }

  private allPlayersHaveFinishedResearch(): boolean {
    for (const player of this.players) {
      if (!this.hasResearched(player)) {
        return false;
      }
    }
    return true;
  }

  private allPlayersHaveFinishedDraft(): boolean {
    for (const player of this.players) {
      if (!this.hasDrafted(player)) {
        return false;
      }
    }
    return true;
  }

  public playerIsFinishedWithResearchPhase(player: IPlayer): void {
    this.deferredActions.runAllFor(player, () => {
      this.researchedPlayers.add(player.id);
      if (this.allPlayersHaveFinishedResearch()) {
        this.phase = Phase.ACTION;
        this.passedPlayers.clear();
        TheNewSpaceRace.potentiallyChangeFirstPlayer(this);
        this.startActionsForPlayer(this.first);
      }
    });
  }

  public playerIsFinishedWithDraftingPhase(initialDraft: boolean, player: IPlayer, cards : Array<IProjectCard>): void {
    this.draftedPlayers.add(player.id);
    this.unDraftedCards.set(player.id, cards);

    player.needsToDraft = false;
    if (this.allPlayersHaveFinishedDraft() === false) {
      return;
    }

    // If more than 1 card are to be passed to the next player, that means we're still drafting
    if (cards.length > 1) {
      this.draftRound++;
      this.runDraftRound(initialDraft);
      return;
    }

    // Push last card for each player
    this.players.forEach((player) => {
      const lastCards = this.unDraftedCards.get(this.getDraftCardsFrom(player).id);
      if (lastCards !== undefined) {
        player.draftedCards.push(...lastCards);
      }
      player.needsToDraft = undefined;

      if (initialDraft) {
        if (this.initialDraftIteration === 2) {
          player.dealtProjectCards = player.draftedCards;
          player.draftedCards = [];
        } else if (this.initialDraftIteration === 3) {
          player.dealtPreludeCards = player.draftedCards;
          player.draftedCards = [];
        }
      }
    });

    if (initialDraft === false) {
      this.gotoResearchPhase();
      return;
    }

    if (this.initialDraftIteration === 1) {
      this.initialDraftIteration++;
      this.draftRound = 1;
      this.runDraftRound(true);
    } else if (this.initialDraftIteration === 2 && this.gameOptions.preludeExtension) {
      this.initialDraftIteration++;
      this.draftRound = 1;
      this.runDraftRound(true, true);
    } else {
      this.gotoInitialResearchPhase();
    }
  }

  private getDraftCardsFrom(player: IPlayer): IPlayer {
    // Special-case for the initial draft direction on second iteration
    if (this.generation === 1 && this.initialDraftIteration === 2) {
      return this.getPlayerBefore(player);
    }

    return this.generation % 2 === 0 ? this.getPlayerBefore(player) : this.getPlayerAfter(player);
  }

  private giveDraftCardsTo(player: IPlayer): IPlayer {
    // Special-case for the initial draft direction on second iteration
    if (this.initialDraftIteration === 2 && this.generation === 1) {
      return this.getPlayerAfter(player);
    }

    return this.generation % 2 === 0 ? this.getPlayerAfter(player) : this.getPlayerBefore(player);
  }

  private getPlayerBefore(player: IPlayer): IPlayer {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex === -1) {
      throw new Error(`Player ${player.id} not in game ${this.id}`);
    }

    // Go to the end of the array if stand at the start
    return this.players[(playerIndex === 0) ? this.players.length - 1 : playerIndex - 1];
  }

  private getPlayerAfter(player: IPlayer): IPlayer {
    const playerIndex = this.players.indexOf(player);

    if (playerIndex === -1) {
      throw new Error(`Player ${player.id} not in game ${this.id}`);
    }

    // Go to the beginning of the array if we reached the end
    return this.players[(playerIndex + 1 >= this.players.length) ? 0 : playerIndex + 1];
  }


  public playerIsFinishedTakingActions(): void {
    if (this.deferredActions.length > 0) {
      this.deferredActions.runAll(() => this.playerIsFinishedTakingActions());
      return;
    }

    this.inputsThisRound = 0;

    // This next section can be done more simply.
    if (this.allPlayersHavePassed()) {
      this.gotoProductionPhase();
      return;
    }

    const nextPlayer = this.getPlayerAfter(this.getPlayerById(this.activePlayer));
    if (!this.hasPassedThisActionPhase(nextPlayer)) {
      this.startActionsForPlayer(nextPlayer);
    } else {
      // Recursively find the next player
      this.activePlayer = nextPlayer.id;
      this.playerIsFinishedTakingActions();
    }
  }

  private async gotoEndGame(): Promise<void> {
    // Log id or cloned game id
    if (this.clonedGamedId !== undefined && this.clonedGamedId.startsWith('#')) {
      const clonedGamedId = this.clonedGamedId;
      this.log('This game was a clone from game ${0}', (b) => b.rawString(clonedGamedId));
    } else {
      const id = this.id;
      this.log('This game id was ${0}', (b) => b.rawString(id));
    }

    const scores: Array<Score> = [];
    this.players.forEach((player) => {
      const corporation = player.corporations.map((c) => c.name).join('|');
      const vpb = player.getVictoryPoints();
      scores.push({corporation: corporation, playerScore: vpb.total});
    });

    Database.getInstance().saveGameResults(this.id, this.players.length, this.generation, this.gameOptions, scores);
    this.phase = Phase.END;
    const gameLoader = GameLoader.getInstance();
    await gameLoader.saveGame(this);
    gameLoader.completeGame(this);
    gameLoader.mark(this.id);
    gameLoader.maintenance();
  }

  // Part of final greenery placement.
  public canPlaceGreenery(player: IPlayer): boolean {
    return !this.donePlayers.has(player.id) &&
            player.plants >= player.plantsNeededForGreenery &&
            this.board.getAvailableSpacesForGreenery(player).length > 0;
  }

  // Called when a player cannot or chose not to place any more greeneries.
  public playerIsDoneWithGame(player: IPlayer): void {
    this.donePlayers.add(player.id);
    // Go back in to find someone else to play final greeneries.
    this.takeNextFinalGreeneryAction();
  }

  /**
   * Find the next player who might be able to place a final greenery and ask them.
   *
   * If nobody can add a greenery, end the game.
   */
  public /* for testing */ takeNextFinalGreeneryAction(): void {
    for (const player of this.getPlayersInGenerationOrder()) {
      if (this.donePlayers.has(player.id)) {
        continue;
      }

      // You many not place greeneries in solo mode unless you have already won the game
      // (e.g. completed global parameters, reached TR63.)
      if (this.isSoloMode() && !this.isSoloModeWin()) {
        this.log('Final greenery phase is skipped since you did not complete the win condition.', (b) => b.forNewGeneration());
        continue;
      }

      if (this.canPlaceGreenery(player)) {
        this.activePlayer = player.id;
        player.takeActionForFinalGreenery();
        return;
      } else if (player.getWaitingFor() !== undefined) {
        return;
      } else {
        this.donePlayers.add(player.id);
      }
    }
    this.updatePlayerVPForTheGeneration();
    this.updateGlobalsForTheGeneration();
    this.gotoEndGame();
  }

  private startActionsForPlayer(player: IPlayer) {
    this.activePlayer = player.id;
    player.actionsTakenThisRound = 0;

    player.takeAction();
  }

  public increaseOxygenLevel(player: IPlayer, increments: -2 | -1 | 1 | 2): void {
    if (this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL) {
      return undefined;
    }

    // PoliticalAgendas Reds P3 && Magnetic Field Stimulation Delays hook
    if (increments < 0) {
      this.oxygenLevel = Math.max(constants.MIN_OXYGEN_LEVEL, this.oxygenLevel + increments);
      return undefined;
    }

    // Literal typing makes |increments| a const
    const steps = Math.min(increments, constants.MAX_OXYGEN_LEVEL - this.oxygenLevel);

    if (this.phase !== Phase.SOLAR) {
      TurmoilHandler.onGlobalParameterIncrease(player, GlobalParameter.OXYGEN, steps);
      player.increaseTerraformRating(steps);
    }
    if (this.oxygenLevel < constants.OXYGEN_LEVEL_FOR_TEMPERATURE_BONUS &&
      this.oxygenLevel + steps >= constants.OXYGEN_LEVEL_FOR_TEMPERATURE_BONUS) {
      this.increaseTemperature(player, 1);
    }

    this.oxygenLevel += steps;

    AresHandler.ifAres(this, (aresData) => {
      AresHandler.onOxygenChange(this, aresData);
    });
  }

  public getOxygenLevel(): number {
    return this.oxygenLevel;
  }

  public increaseVenusScaleLevel(player: IPlayer, increments: -1 | 1 | 2 | 3): number {
    if (this.venusScaleLevel >= constants.MAX_VENUS_SCALE) {
      return 0;
    }

    // PoliticalAgendas Reds P3 hook
    if (increments === -1) {
      this.venusScaleLevel = Math.max(constants.MIN_VENUS_SCALE, this.venusScaleLevel + increments * 2);
      return -1;
    }

    // Literal typing makes |increments| a const
    const steps = Math.min(increments, (constants.MAX_VENUS_SCALE - this.venusScaleLevel) / 2);

    if (this.phase !== Phase.SOLAR) {
      if (this.venusScaleLevel < constants.VENUS_LEVEL_FOR_CARD_BONUS &&
        this.venusScaleLevel + steps * 2 >= constants.VENUS_LEVEL_FOR_CARD_BONUS) {
        player.drawCard();
      }
      if (this.venusScaleLevel < constants.VENUS_LEVEL_FOR_TR_BONUS &&
        this.venusScaleLevel + steps * 2 >= constants.VENUS_LEVEL_FOR_TR_BONUS) {
        player.increaseTerraformRating();
      }
      if (this.gameOptions.altVenusBoard) {
        const newValue = this.venusScaleLevel + steps * 2;
        const minimalBaseline = Math.max(this.venusScaleLevel, constants.ALT_VENUS_MINIMUM_BONUS);
        const maximumBaseline = Math.min(newValue, constants.MAX_VENUS_SCALE);
        const standardResourcesGranted = Math.max((maximumBaseline - minimalBaseline) / 2, 0);

        const grantWildResource = this.venusScaleLevel + (steps * 2) >= constants.MAX_VENUS_SCALE;
        // The second half of this expression removes any increases earler than 16-to-18.
        if (grantWildResource || standardResourcesGranted > 0) {
          this.defer(new GrantVenusAltTrackBonusDeferred(player, standardResourcesGranted, grantWildResource));
        }
      }
      TurmoilHandler.onGlobalParameterIncrease(player, GlobalParameter.VENUS, steps);
      player.increaseTerraformRating(steps);
    }

    // Check for Aphrodite corporation
    const aphrodite = this.players.find((player) => player.isCorporation(CardName.APHRODITE));
    if (aphrodite !== undefined) {
      aphrodite.megaCredits += steps * 2;
    }

    this.venusScaleLevel += steps * 2;

    return steps;
  }

  public getVenusScaleLevel(): number {
    return this.venusScaleLevel;
  }

  public increaseTemperature(player: IPlayer, increments: -2 | -1 | 1 | 2 | 3): undefined {
    if (this.temperature >= constants.MAX_TEMPERATURE) {
      return undefined;
    }

    if (increments === -2 || increments === -1) {
      this.temperature = Math.max(constants.MIN_TEMPERATURE, this.temperature + increments * 2);
      return undefined;
    }

    // Literal typing makes |increments| a const
    const steps = Math.min(increments, (constants.MAX_TEMPERATURE - this.temperature) / 2);

    if (this.phase !== Phase.SOLAR) {
      // BONUS FOR HEAT PRODUCTION AT -20 and -24
      if (this.temperature < constants.TEMPERATURE_BONUS_FOR_HEAT_1 &&
        this.temperature + steps * 2 >= constants.TEMPERATURE_BONUS_FOR_HEAT_1) {
        player.production.add(Resource.HEAT, 1, {log: true});
      }
      if (this.temperature < constants.TEMPERATURE_BONUS_FOR_HEAT_2 &&
        this.temperature + steps * 2 >= constants.TEMPERATURE_BONUS_FOR_HEAT_2) {
        player.production.add(Resource.HEAT, 1, {log: true});
      }

      player.playedCards.forEach((card) => card.onGlobalParameterIncrease?.(player, GlobalParameter.TEMPERATURE, steps));
      TurmoilHandler.onGlobalParameterIncrease(player, GlobalParameter.TEMPERATURE, steps);
      player.increaseTerraformRating(steps);
    }

    // BONUS FOR OCEAN TILE AT 0
    if (this.temperature < constants.TEMPERATURE_FOR_OCEAN_BONUS && this.temperature + steps * 2 >= constants.TEMPERATURE_FOR_OCEAN_BONUS) {
      this.defer(new PlaceOceanTile(player, {title: 'Select space for ocean from temperature increase'}));
    }

    this.temperature += steps * 2;

    AresHandler.ifAres(this, (aresData) => {
      AresHandler.onTemperatureChange(this, aresData);
    });
    UnderworldExpansion.onTemperatureChange(this, steps);
    return undefined;
  }

  public getTemperature(): number {
    return this.temperature;
  }

  public getGeneration(): number {
    return this.generation;
  }

  public getPassedPlayers():Array<Color> {
    const passedPlayersColors: Array<Color> = [];
    this.passedPlayers.forEach((player) => {
      passedPlayersColors.push(this.getPlayerById(player).color);
    });
    return passedPlayersColors;
  }

  // addTile applies to the Mars board, but not the Moon board, see MoonExpansion.addTile for placing
  // a tile on The Moon.
  public addTile(
    player: IPlayer,
    space: Space,
    tile: Tile): void {
    // Part 1, basic validation checks.

    if (space.tile !== undefined && !(this.gameOptions.aresExtension || this.gameOptions.pathfindersExpansion)) {
      throw new Error('Selected space is occupied');
    }

    // Land claim a player can claim land for themselves
    if (space.player !== undefined && space.player !== player) {
      throw new Error('This space is land claimed by ' + space.player.name);
    }

    if (!AresHandler.canCover(space, tile)) {
      throw new Error('Selected space is occupied: ' + space.id);
    }

    // Oceans are not subject to Ares adjacency production penalties.
    const subjectToHazardAdjacency = tile.tileType !== TileType.OCEAN;

    AresHandler.ifAres(this, () => {
      AresHandler.assertCanPay(player, space, subjectToHazardAdjacency);
    });

    // Part 2. Collect additional fees.
    // Adjacency costs are before the hellas ocean tile because this is a mandatory cost.
    AresHandler.ifAres(this, () => {
      AresHandler.payAdjacencyAndHazardCosts(player, space, subjectToHazardAdjacency);
    });

    TurmoilHandler.resolveTilePlacementCosts(player);

    // Part 3. Setup for bonuses
    const initialTileTypeForAres = space.tile?.tileType;
    const coveringExistingTile = space.tile !== undefined;

    // Part 4. Place the tile
    this.simpleAddTile(player, space, tile);

    // Part 5. Collect the bonuses
    if (this.phase !== Phase.SOLAR) {
      this.grantPlacementBonuses(player, space, coveringExistingTile);

      AresHandler.ifAres(this, (aresData) => {
        AresHandler.maybeIncrementMilestones(aresData, player, space);
      });
    } else {
      space.player = undefined;
    }

    this.players.forEach((p) => {
      p.tableau.forEach((playedCard) => {
        playedCard.onTilePlaced?.(p, player, space, BoardType.MARS);
      });
    });

    AresHandler.ifAres(this, () => {
      AresHandler.grantBonusForRemovingHazard(player, initialTileTypeForAres);
    });

    if (this.gameOptions.underworldExpansion) {
      if (space.spaceType !== SpaceType.COLONY && space.player === player) {
        UnderworldExpansion.identify(this, space, player);
      }
    }
  }

  public grantPlacementBonuses(player: IPlayer, space: Space, coveringExistingTile: boolean) {
    if (!coveringExistingTile) {
      this.grantSpaceBonuses(player, space);
    }

    this.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      if (Board.isOceanSpace(adjacentSpace)) {
        player.megaCredits += player.oceanBonus;
      }
    });

    if (space.tile !== undefined) {
      AresHandler.ifAres(this, () => {
        AresHandler.earnAdjacencyBonuses(player, space);
      });

      TurmoilHandler.resolveTilePlacementBonuses(player, space.spaceType);

      const arcadianCommunityBonus = space.player === player && player.isCorporation(CardName.ARCADIAN_COMMUNITIES);
      if (arcadianCommunityBonus) {
        this.defer(new GainResources(player, Resource.MEGACREDITS, {count: 3}));
      }
    }
  }

  public simpleAddTile(player: IPlayer, space: Space, tile: Tile) {
    space.tile = tile;
    if (tile.tileType === TileType.OCEAN ||
      tile.tileType === TileType.MARTIAN_NATURE_WONDERS ||
      tile.tileType === TileType.REY_SKYWALKER) {
      space.player = undefined;
    } else {
      space.player = player;
    }
    LogHelper.logTilePlacement(player, space, tile.tileType);
  }

  public grantSpaceBonuses(player: IPlayer, space: Space) {
    const bonuses = MultiSet.from(space.bonus);
    bonuses.forEachMultiplicity((count: number, bonus: SpaceBonus) => {
      this.grantSpaceBonus(player, bonus, count);
    });
  }

  public grantSpaceBonus(player: IPlayer, spaceBonus: SpaceBonus, count: number = 1) {
    switch (spaceBonus) {
    case SpaceBonus.DRAW_CARD:
      player.drawCard(count);
      break;
    case SpaceBonus.PLANT:
      player.stock.add(Resource.PLANTS, count, {log: true});
      break;
    case SpaceBonus.STEEL:
      player.stock.add(Resource.STEEL, count, {log: true});
      break;
    case SpaceBonus.TITANIUM:
      player.stock.add(Resource.TITANIUM, count, {log: true});
      break;
    case SpaceBonus.HEAT:
      player.stock.add(Resource.HEAT, count, {log: true});
      break;
    case SpaceBonus.OCEAN:
      // Hellas special requirements ocean tile
      if (this.canAddOcean()) {
        this.defer(new PlaceOceanTile(player, {title: 'Select space for ocean from placement bonus'}));
        this.defer(new SelectPaymentDeferred(player, constants.HELLAS_BONUS_OCEAN_COST, {title: 'Select how to pay for placement bonus ocean'}));
      }
      break;
    case SpaceBonus.MICROBE:
      this.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: count}));
      break;
    case SpaceBonus.ANIMAL:
      this.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {count: count}));
      break;
    case SpaceBonus.DATA:
      this.defer(new AddResourcesToCard(player, CardResource.DATA, {count: count}));
      break;
    case SpaceBonus.ENERGY_PRODUCTION:
      player.production.add(Resource.ENERGY, count, {log: true});
      break;
    case SpaceBonus.SCIENCE:
      this.defer(new AddResourcesToCard(player, CardResource.SCIENCE, {count: count}));
      break;
    case SpaceBonus.TEMPERATURE:
      if (this.getTemperature() < constants.MAX_TEMPERATURE) {
        player.defer(() => this.increaseTemperature(player, 1));
        this.defer(new SelectPaymentDeferred(
          player,
          constants.VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST,
          {title: 'Select how to pay for placement bonus temperature'}));
      }
      break;
    case SpaceBonus.ENERGY:
      player.stock.add(Resource.ENERGY, count, {log: true});
      break;
    case SpaceBonus.ASTEROID:
      this.defer(new AddResourcesToCard(player, CardResource.ASTEROID, {count: count}));
      break;
    default:
      throw new Error('Unhandled space bonus ' + spaceBonus + '. Report this exact error, please.');
    }
  }

  public addGreenery(
    player: IPlayer, space: Space,
    shouldRaiseOxygen: boolean = true): undefined {
    this.addTile(player, space, {
      tileType: TileType.GREENERY,
    });
    // Turmoil Greens ruling policy
    PartyHooks.applyGreensRulingPolicy(player, space);

    if (shouldRaiseOxygen) this.increaseOxygenLevel(player, 1);
    return undefined;
  }

  public addCity(
    player: IPlayer, space: Space,
    cardName: CardName | undefined = undefined): void {
    this.addTile(player, space, {
      tileType: TileType.CITY,
      card: cardName,
    });
  }

  public canAddOcean(): boolean {
    return this.board.getOceanSpaces().length < constants.MAX_OCEAN_TILES;
  }

  public canRemoveOcean(): boolean {
    const count = this.board.getOceanSpaces().length;
    return count > 0 && count < constants.MAX_OCEAN_TILES;
  }

  public addOcean(player: IPlayer, space: Space): void {
    if (this.canAddOcean() === false) return;

    this.addTile(player, space, {
      tileType: TileType.OCEAN,
    });
    if (this.phase !== Phase.SOLAR) {
      TurmoilHandler.onGlobalParameterIncrease(player, GlobalParameter.OCEANS);
      player.increaseTerraformRating();
    }
    AresHandler.ifAres(this, (aresData) => {
      AresHandler.onOceanPlaced(aresData, player);
    });
  }

  public removeTile(spaceId: SpaceId): void {
    const space = this.board.getSpaceOrThrow(spaceId);
    space.tile = undefined;
    space.player = undefined;
  }

  public getPlayers(): ReadonlyArray<IPlayer> {
    return this.players;
  }

  // Players returned in play order starting with first player this generation.
  public getPlayersInGenerationOrder(): ReadonlyArray<IPlayer> {
    const ret: Array<IPlayer> = [];
    let insertIdx = 0;
    for (const p of this.players) {
      if (p.id === this.first.id || insertIdx > 0) {
        ret.splice(insertIdx, 0, p);
        insertIdx ++;
      } else {
        ret.push(p);
      }
    }
    return ret;
  }

  /**
   * Returns the Player holding this card, or throws.
   */
  public getCardPlayerOrThrow(name: CardName): IPlayer {
    const player = this.getCardPlayerOrUndefined(name);
    if (player === undefined) {
      throw new Error(`No player has played ${name}`);
    }
    return player;
  }

  /**
   * Returns the Player holding this card, or throws.
   */
  public getCardPlayerOrUndefined(name: CardName): IPlayer | undefined {
    for (const player of this.players) {
      for (const card of player.tableau) {
        if (card.name === name) {
          return player;
        }
      }
    }
    return undefined;
  }

  // Returns the player holding a card in hand. Return undefined when nobody has that card in hand.
  public getCardHolder(name: CardName): [IPlayer | undefined, IProjectCard | undefined] {
    for (const player of this.players) {
      // Check cards player has in hand
      for (const card of [...player.preludeCardsInHand, ...player.cardsInHand]) {
        if (card.name === name) {
          return [player, card];
        }
      }
    }
    return [undefined, undefined];
  }

  public getCardsInHandByResource(player: IPlayer, resourceType: CardResource) {
    return player.cardsInHand.filter((card) => card.resourceType === resourceType);
  }

  public getCardsInHandByType(player: IPlayer, cardType: CardType) {
    return player.cardsInHand.filter((card) => card.type === cardType);
  }

  public log(message: string, f?: (builder: LogMessageBuilder) => void, options?: {reservedFor?: IPlayer}) {
    const builder = new LogMessageBuilder(message);
    f?.(builder);
    const logMessage = builder.build();
    logMessage.playerId = options?.reservedFor?.id;
    this.gameLog.push(logMessage);
    this.gameAge++;
  }

  public discardForCost(cardCount: 1 | 2, toPlace: TileType) {
    // This method uses drawOrThrow, which means if there are really no more cards, it breaks the game.
    // I predict it will be an exceedingly rare problem.
    if (cardCount === 1) {
      const card = this.projectDeck.drawOrThrow(this);
      this.projectDeck.discard(card);
      this.log('Drew and discarded ${0} to place a ${1}', (b) => b.card(card, {cost: true}).tileType(toPlace));
      return card.cost;
    } else {
      const card1 = this.projectDeck.drawOrThrow(this);
      this.projectDeck.discard(card1);
      const card2 = this.projectDeck.drawOrThrow(this);
      this.projectDeck.discard(card2);
      this.log('Drew and discarded ${0} and ${1} to place a ${2}', (b) => b.card(card1, {cost: true}).card(card2, {cost: true}).tileType(toPlace));
      return card1.cost + card2.cost;
    }
  }

  public getSpaceByOffset(direction: -1 | 1, toPlace: TileType, cardCount: 1 | 2 = 1) {
    const cost = this.discardForCost(cardCount, toPlace);

    const distance = Math.max(cost - 1, 0); // Some cards cost zero.
    const space = this.board.getNthAvailableLandSpace(distance, direction, undefined /* player */,
      (space) => {
        // TODO(kberg): this toPlace check is a short-term hack.
        //
        // If the tile is a city, then follow these extra placement rules for initial solo player placement.
        // Otherwise it's a hazard tile, and the city rules don't matter. Ideally this should just split into separate functions,
        // which would be nice, since it makes Game smaller.
        if (toPlace === TileType.CITY) {
          const adjacentSpaces = this.board.getAdjacentSpaces(space);
          return adjacentSpaces.every((sp) => sp.tile?.tileType !== TileType.CITY) && // no cities nearby
              adjacentSpaces.some((sp) => this.board.canPlaceTile(sp)); // can place forest nearby
        } else {
          return true;
        }
      });
    if (space === undefined) {
      throw new Error('Couldn\'t find space when card cost is ' + cost);
    }
    return space;
  }

  public expectedPurgeTimeMs(): number {
    if (this.createdTime.getTime() === 0) {
      return 0;
    }
    const days = dayStringToDays(process.env.MAX_GAME_DAYS, 10);
    return addDays(this.createdTime, days).getTime();
  }

  public static deserialize(d: SerializedGame): Game {
    const gameOptions = d.gameOptions;

    const players = d.players.map((element) => Player.deserialize(element));
    const first = players.find((player) => player.id === d.first);
    if (first === undefined) {
      throw new Error(`Player ${d.first} not found when rebuilding First Player`);
    }

    const board = GameSetup.deserializeBoard(players, gameOptions, d);

    const rng = new SeededRandom(d.seed, d.currentSeed);

    const projectDeck = ProjectDeck.deserialize(d.projectDeck, rng);
    const corporationDeck = CorporationDeck.deserialize(d.corporationDeck, rng);
    const preludeDeck = PreludeDeck.deserialize(d.preludeDeck, rng);

    const ceoDeck = CeoDeck.deserialize(d.ceoDeck, rng);

    const game = new Game(d.id, players, first, d.activePlayer, gameOptions, rng, board, projectDeck, corporationDeck, preludeDeck, ceoDeck);
    game.resettable = true;
    game.spectatorId = d.spectatorId;
    game.createdTime = new Date(d.createdTimeMs);

    const milestones: Array<IMilestone> = [];
    d.milestones.forEach((element: IMilestone | string) => {
      const milestoneName = typeof element === 'string' ? element : element.name;
      const foundMilestone = ALL_MILESTONES.find((milestone) => milestone.name === milestoneName);
      if (foundMilestone !== undefined) {
        milestones.push(foundMilestone);
      }
    });

    game.milestones = milestones;
    game.claimedMilestones = deserializeClaimedMilestones(d.claimedMilestones, players, milestones);

    const awards: Array<IAward> = [];
    d.awards.forEach((element: IAward | string) => {
      const awardName = typeof element === 'string' ? element : element.name;
      const foundAward = ALL_AWARDS.find((award) => award.name === awardName);
      if (foundAward !== undefined) {
        awards.push(foundAward);
      }
    });

    game.awards = awards;
    game.fundedAwards = deserializeFundedAwards(d.fundedAwards, players, awards);

    if (gameOptions.aresExtension) {
      game.aresData = d.aresData;
    }
    // Reload colonies elements if needed
    if (gameOptions.coloniesExtension) {
      game.colonies = ColonyDeserializer.deserializeAndFilter(d.colonies);
      const colonyDealer = new ColonyDealer(rng, gameOptions);
      colonyDealer.restore(game.colonies);
      game.discardedColonies = colonyDealer.discardedColonies;
    }

    // Reload turmoil elements if needed
    if (d.turmoil && gameOptions.turmoilExtension) {
      game.turmoil = Turmoil.deserialize(d.turmoil, players);
    }

    // Reload moon elements if needed
    if (d.moonData !== undefined && gameOptions.moonExpansion === true) {
      game.moonData = MoonData.deserialize(d.moonData, players);
    }

    if (d.pathfindersData !== undefined && gameOptions.pathfindersExpansion === true) {
      game.pathfindersData = PathfindersData.deserialize(d.pathfindersData);
    }

    if (d.underworldData !== undefined) {
      game.underworldData = d.underworldData;
    }
    game.passedPlayers = new Set<PlayerId>(d.passedPlayers);
    game.donePlayers = new Set<PlayerId>(d.donePlayers);
    game.researchedPlayers = new Set<PlayerId>(d.researchedPlayers);
    game.draftedPlayers = new Set<PlayerId>(d.draftedPlayers);

    // Reinit undrafted cards map
    game.unDraftedCards = new Map<PlayerId, IProjectCard[]>();
    d.unDraftedCards.forEach((unDraftedCard) => {
      game.unDraftedCards.set(unDraftedCard[0], cardsFromJSON(unDraftedCard[1]));
    });

    game.lastSaveId = d.lastSaveId;
    game.clonedGamedId = d.clonedGamedId;
    game.gameAge = d.gameAge;
    game.gameLog = d.gameLog;
    game.generation = d.generation;
    game.phase = d.phase;
    game.oxygenLevel = d.oxygenLevel;
    game.undoCount = d.undoCount ?? 0;
    game.temperature = d.temperature;
    game.venusScaleLevel = d.venusScaleLevel;
    game.activePlayer = d.activePlayer;
    game.draftRound = d.draftRound;
    game.initialDraftIteration = d.initialDraftIteration;
    game.someoneHasRemovedOtherPlayersPlants = d.someoneHasRemovedOtherPlayersPlants;
    game.syndicatePirateRaider = d.syndicatePirateRaider;
    game.gagarinBase = d.gagarinBase;
    game.stJosephCathedrals = d.stJosephCathedrals;
    game.nomadSpace = d.nomadSpace;
    game.tradeEmbargo = d.tradeEmbargo ?? false;
    game.beholdTheEmperor = d.beholdTheEmperor ?? false;
    game.globalsPerGeneration = d.globalsPerGeneration;
    // Still in Draft or Research of generation 1
    if (game.generation === 1 && players.some((p) => p.corporations.length === 0)) {
      if (game.phase === Phase.INITIALDRAFTING) {
        if (game.initialDraftIteration === 3) {
          game.runDraftRound(true, true);
        } else {
          game.runDraftRound(true);
        }
      } else {
        game.gotoInitialResearchPhase();
      }
    } else if (game.phase === Phase.DRAFTING) {
      game.runDraftRound();
    } else if (game.phase === Phase.RESEARCH) {
      game.gotoResearchPhase();
    } else if (game.phase === Phase.END) {
      // There's nowhere that we need to go for end game.
    } else {
      // We should be in ACTION phase, let's prompt the active player for actions
      game.getPlayerById(game.activePlayer).takeAction(/* saveBeforeTakingAction */ false);
    }

    if (game.phase === Phase.END) GameLoader.getInstance().mark(game.id);
    return game;
  }

  public logIllegalState(description: string, metadata: {}) {
    const gameMetadata = {
      gameId: this.id,
      lastSaveId: this.lastSaveId,
      logAge: this.gameLog.length,
      currentPlayer: this.activePlayer,

      metadata: metadata,
    };
    console.warn('Illegal state: ' + description, JSON.stringify(gameMetadata, null, ' '));
  }
}
