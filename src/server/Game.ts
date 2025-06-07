
import * as constants from '../common/constants';
import {BeginnerCorporation} from './cards/corporation/BeginnerCorporation';
import {Board} from './boards/Board';
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
import {milestoneManifest} from './milestones/Milestones';
import {awardManifest} from './awards/Awards';
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
import {AresData, deserializeAresData} from '../common/ares/AresData';
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
import {addDays, stringToNumber} from './database/utils';
import {ALL_TAGS, Tag} from '../common/cards/Tag';
import {IGame, Score} from './IGame';
import {MarsBoard} from './boards/MarsBoard';
import {UnderworldData} from './underworld/UnderworldData';
import {UnderworldExpansion} from './underworld/UnderworldExpansion';
import {SpaceType} from '../common/boards/SpaceType';
import {SendDelegateToArea} from './deferredActions/SendDelegateToArea';
import {BuildColony} from './deferredActions/BuildColony';
import {newInitialDraft, newPreludeDraft, newStandardDraft} from './Draft';
import {toID, toName} from '../common/utils/utils';
import {OrOptions} from './inputs/OrOptions';
import {SelectOption} from './inputs/SelectOption';
import {SelectSpace} from './inputs/SelectSpace';
import {maybeRenamedMilestone} from '../common/ma/MilestoneName';
import {maybeRenamedAward} from '../common/ma/AwardName';
import {Eris} from './cards/community/Eris';
import {AresHazards} from './ares/AresHazards';
import {hazardSeverity} from '../common/AresTileType';
import {IStandardProjectCard} from './cards/IStandardProjectCard';

// Can be overridden by tests

let createGameLog: () => Array<LogMessage> = () => [];

export function setGameLog(f: () => Array<LogMessage>) {
  createGameLog = f;
}

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
  public gameLog: Array<LogMessage> = createGameLog();
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
  /** Players that are done with the game after final greenery placement. */
  private donePlayers = new Set<PlayerId>();
  private passedPlayers = new Set<PlayerId>();
  private researchedPlayers = new Set<PlayerId>();
  /** The first player of this generation. */
  public first: IPlayer;

  // Drafting

  public draftRound: number = 1;
  public initialDraftIteration: number = 1;

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
  public inTurmoil: boolean = false;

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
  // Double Down
  public inDoubleDown: boolean = false;
  // Vermin
  public verminInEffect: boolean = false;

  /* The set of tags available in this game. */
  public readonly tags: ReadonlyArray<Tag>;

  /*
   * An optimized list of the players, in generation order. This is erased every time first placer changes,
   * and refilled on calls to getPlayersInGenerationOrder
   */
  playersInGenerationOrder: Array<IPlayer> = [];

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
    ceoDeck: CeoDeck,
    tags: ReadonlyArray<Tag>) {
    this.id = id;
    this.gameOptions = {...gameOptions};
    this.players = players;
    const playerIds = players.map(toID);
    if (playerIds.includes(first.id) === false) {
      throw new Error('Cannot find first player ' + first.id + ' in [' + playerIds + ']');
    }
    if (playerIds.includes(activePlayer) === false) {
      throw new Error('Cannot find active player ' + activePlayer + ' in [' + playerIds + ']');
    }
    if (new Set(playerIds).size !== players.length) {
      throw new Error('Duplicate player found: [' + playerIds + ']');
    }
    const colors = players.map((p) => p.color);
    if (new Set(colors).size !== players.length) {
      throw new Error('Duplicate color found: [' + colors + ']');
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

    this.tags = tags;
    // TODO(kberg): Remove this count by 2025-06-01
    if (this.tags.length === 0) {
      this.tags = ALL_TAGS.filter((tag) => {
        if (tag === Tag.VENUS) return gameOptions.venusNextExtension;
        if (tag === Tag.MOON) return gameOptions.moonExpansion;
        if (tag === Tag.MARS) return gameOptions.pathfindersExpansion;
        if (tag === Tag.CLONE) return gameOptions.pathfindersExpansion;
        return true;
      });
    }
  }

  public static newInstance(id: GameId,
    players: Array<IPlayer>,
    firstPlayer: IPlayer,
    options: Partial<GameOptions> = {},
    seed = 0,
    spectatorId: SpectatorId | undefined = undefined): Game {
    if (options.expansions === undefined) {
      options.expansions = {
        corpera: options.corporateEra ?? false,
        venus: options.venusNextExtension ?? false,
        colonies: options.coloniesExtension ?? false,
        prelude: options.preludeExtension ?? false,
        prelude2: options.prelude2Expansion ?? false,
        turmoil: options.turmoilExtension ?? false,
        promo: options.promoCardsOption ?? false,
        community: options.communityCardsOption ?? false,
        ares: options.aresExtension ?? false,
        moon: options.moonExpansion ?? false,
        pathfinders: options.pathfindersExpansion ?? false,
        ceo: options.ceoExtension ?? false,
        starwars: options.starWarsExpansion ?? false,
        underworld: options.underworldExpansion ?? false,
      };
    }
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

    const tags = new Set<Tag>();
    for (const deck of [projectDeck, corporationDeck, preludeDeck, ceoDeck]) {
      for (const card of deck.drawPile) {
        for (const tag of card.tags) {
          tags.add(tag);
        }
      }
    }

    if (players.length === 1) {
      gameOptions.draftVariant = false;
      gameOptions.initialDraftVariant = false;
      gameOptions.preludeDraftVariant = false;
      gameOptions.randomMA = RandomMAOptionType.NONE;

      // Single player game player starts with 14TR
      players[0].setTerraformRating(14);
    }

    const game = new Game(id, players, firstPlayer, activePlayer, gameOptions, rng, board, projectDeck, corporationDeck, preludeDeck, ceoDeck, Array.from(tags));
    game.spectatorId = spectatorId;
    // This evaluation of created time doesn't match what's stored in the database, but that's fine.
    game.createdTime = new Date();
    // Initialize Ares data
    if (gameOptions.aresExtension) {
      game.aresData = AresSetup.initialData(gameOptions.aresHazards, players);
    }

    const {milestones, awards} = chooseMilestonesAndAwards(gameOptions);
    game.milestones = milestones.map(milestoneManifest.createOrThrow);
    game.awards = awards.map(awardManifest.createOrThrow);

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
      game.moonData = MoonExpansion.initialize(gameOptions, rng);
    }

    if (gameOptions.pathfindersExpansion) {
      game.pathfindersData = PathfindersExpansion.initialize(game);
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
        gameOptions.prelude2Expansion ||
        gameOptions.venusNextExtension ||
        gameOptions.coloniesExtension ||
        gameOptions.turmoilExtension ||
        gameOptions.initialDraftVariant ||
        gameOptions.preludeDraftVariant ||
        gameOptions.underworldExpansion ||
        gameOptions.moonExpansion) {
        player.dealtCorporationCards.push(...corporationDeck.drawN(game, gameOptions.startingCorporations));
        if (gameOptions.initialDraftVariant === false) {
          player.dealtProjectCards.push(...projectDeck.drawN(game, 10));
        }
        if (gameOptions.preludeExtension) {
          gameOptions.startingPreludes = Math.max(gameOptions.startingPreludes ?? 0, constants.PRELUDE_CARDS_DEALT_PER_PLAYER);
          player.dealtPreludeCards.push(...preludeDeck.drawN(game, gameOptions.startingPreludes));
        }
        if (gameOptions.ceoExtension) {
          gameOptions.startingCeos = Math.max(gameOptions.startingCeos ?? 0, constants.CEO_CARDS_DEALT_PER_PLAYER);
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

  /** Properly starts the game with the project draft, or initial research phase. */
  public gotoInitialPhase(): void {
    // Initial Draft
    if (this.gameOptions.initialDraftVariant) {
      this.phase = Phase.INITIALDRAFTING;
      newInitialDraft(this).startDraft();
    } else {
      this.gotoInitialResearchPhase();
    }
  }

  public save(): void {
    GameLoader.getInstance().saveGame(this);
  }

  public serialize(): SerializedGame {
    const result: SerializedGame = {
      activePlayer: this.activePlayer,
      awards: this.awards.map(toName),
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
      milestones: this.milestones.map(toName),
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
      tags: this.tags,
      temperature: this.temperature,
      tradeEmbargo: this.tradeEmbargo,
      underworldData: this.underworldData,
      undoCount: this.undoCount,
      venusScaleLevel: this.venusScaleLevel,
      verminInEffect: this.verminInEffect,
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
    // Option "requiresVenusTrackCompletion" also makes maximizing Venus a game-end requirement
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

    // Ares Extreme: Solo player must remove all unprotected hazards to win
    if (this.gameOptions.aresExtension && this.gameOptions.aresExtremeVariant) {
      const unprotectedHazardsRemaining = Eris.getAllUnprotectedHazardSpaces(this);
      if (unprotectedHazardsRemaining.length > 0) return false;
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
    // TODO(kberg): I think we can get rid of this weird validation at a later time.
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
    let firstIndex = this.players.map(toID).indexOf(this.first.id);
    if (firstIndex === -1) {
      throw new Error('Didn\'t even find player');
    }
    firstIndex = (firstIndex + 1) % this.players.length;
    this.first = this.players[firstIndex];
    this.playersInGenerationOrder.length = 0;
  }

  // Only used in the prelude The New Space Race.
  public overrideFirstPlayer(newFirstPlayer: IPlayer): void {
    if (newFirstPlayer.game.id !== this.id) {
      throw new Error(`player ${newFirstPlayer.id} is not part of this game`);
    }
    this.first = newFirstPlayer;
    this.playersInGenerationOrder.length = 0;
  }

  public gotoInitialResearchPhase(): void {
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

  public gotoResearchPhase(): void {
    this.phase = Phase.RESEARCH;
    this.researchedPlayers.clear();
    this.save();
    this.players.forEach((player) => {
      player.runResearchPhase();
    });
  }

  private gotoDraftPhase(): void {
    this.phase = Phase.DRAFTING;
    this.draftRound = 1;
    newStandardDraft(this).startDraft();
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

    // Maybe spawn a new hazard on Mars every 3 generations
    if (this.gameOptions.aresExtension && this.gameOptions.aresExtremeVariant && this.generation % 3 === 0) {
      const direction = Math.floor(this.rng.nextInt(2)) === 0 ? 'top' : 'bottom';
      const tileType = this.board.getOceanSpaces().length >= 3 ? TileType.EROSION_MILD : TileType.DUST_STORM_MILD;

      AresHazards.randomlyPlaceHazard(this, tileType, direction);
    }

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
    if (this.deferredActions.length > 0) {
      this.deferredActions.runAll(() => this.gotoEndGeneration());
      return;
    }

    this.endGenerationForColonies();
    UnderworldExpansion.endGeneration(this);

    Turmoil.ifTurmoil(this, (turmoil) => {
      // this.phase = Phase.TURMOIL;
      this.inTurmoil = true;
      turmoil.endGeneration(this);
      // Behold The Emperor hook
      this.beholdTheEmperor = false;
    });

    // turmoil.endGeneration might have added actions.
    if (this.deferredActions.length > 0) {
      this.deferredActions.runAll(() => this.startGeneration());
    } else {
      this.inTurmoil = false;
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
      if (player.cardIsInEffect(CardName.PRESERVATION_PROGRAM)) {
        player.preservationProgram = true;
      }
    });

    if (this.gameOptions.draftVariant) {
      this.gotoDraftPhase();
    } else {
      this.gotoResearchPhase();
    }
  }

  private gotoWorldGovernmentTerraforming() {
    this.worldGovernmentTerraforming();
  }

  public worldGovernmentTerraformingInput(player: IPlayer): OrOptions {
    const orOptions = new OrOptions()
      .setTitle('Select action for World Government Terraforming')
      .setButtonLabel('Confirm');
    if (this.getTemperature() < constants.MAX_TEMPERATURE) {
      orOptions.options.push(
        new SelectOption('Increase temperature', 'Increase').andThen(() => {
          this.increaseTemperature(player, 1);
          this.log('${0} acted as World Government and increased temperature', (b) => b.player(player));
          return undefined;
        }),
      );
    }
    if (this.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL) {
      orOptions.options.push(
        new SelectOption('Increase oxygen', 'Increase').andThen(() => {
          this.increaseOxygenLevel(player, 1);
          this.log('${0} acted as World Government and increased oxygen level', (b) => b.player(player));
          return undefined;
        }),
      );
    }
    if (this.canAddOcean()) {
      orOptions.options.push(
        new SelectSpace('Add an ocean', this.board.getAvailableSpacesForOcean(player))
          .andThen((space) => {
            this.addOcean(player, space);
            this.log('${0} acted as World Government and placed an ocean', (b) => b.player(player));
            return undefined;
          }),
      );
    }
    if (this.getVenusScaleLevel() < constants.MAX_VENUS_SCALE && this.gameOptions.venusNextExtension) {
      orOptions.options.push(
        new SelectOption('Increase Venus scale', 'Increase').andThen(() => {
          this.increaseVenusScaleLevel(player, 1);
          this.log('${0} acted as World Government and increased Venus scale', (b) => b.player(player));
          return undefined;
        }),
      );
    }

    if (this.gameOptions.aresExtension && this.gameOptions.aresExtremeVariant && this.isSoloMode()) {
      // TODO(kberg): move the eris method elsewhere
      const unprotectedHazardSpaces = Eris.getAllUnprotectedHazardSpaces(this);

      if (unprotectedHazardSpaces.length > 0) {
        orOptions.options.push(
          new SelectSpace(
            'Remove an unprotected hazard',
            unprotectedHazardSpaces).andThen((space) => {
            space.tile = undefined;
            this.log('${0} acted as World Government and removed a hazard tile', (b) => b.player(player));
            return undefined;
          }),
        );
      }
    }

    MoonExpansion.ifMoon(this, (moonData) => {
      if (moonData.habitatRate < constants.MAXIMUM_HABITAT_RATE) {
        orOptions.options.push(
          new SelectOption('Increase the Moon habitat rate', 'Increase').andThen(() => {
            MoonExpansion.raiseHabitatRate(player, 1);
            return undefined;
          }),
        );
      }

      if (moonData.miningRate < constants.MAXIMUM_MINING_RATE) {
        orOptions.options.push(
          new SelectOption('Increase the Moon mining rate', 'Increase').andThen(() => {
            MoonExpansion.raiseMiningRate(player, 1);
            return undefined;
          }),
        );
      }

      if (moonData.logisticRate < constants.MAXIMUM_LOGISTICS_RATE) {
        orOptions.options.push(
          new SelectOption('Increase the Moon logistics rate', 'Increase').andThen(() => {
            MoonExpansion.raiseLogisticRate(player, 1);
            return undefined;
          }),
        );
      }
    });

    return orOptions;
  }

  public worldGovernmentTerraforming(): void {
    const player = this.first;
    const input = this.worldGovernmentTerraformingInput(player);
    player.setWaitingFor(input, () => {
      this.gotoEndGeneration();
    });
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

  public playerIsFinishedWithResearchPhase(player: IPlayer): void {
    this.deferredActions.runAllFor(player, () => {
      this.researchedPlayers.add(player.id);
      if (this.researchedPlayers.size === this.players.length) {
        this.researchedPlayers.clear();
        this.phase = Phase.ACTION;
        this.passedPlayers.clear();
        TheNewSpaceRace.potentiallyChangeFirstPlayer(this);
        this.startActionsForPlayer(this.first);
      }
    });
  }

  public getPlayerBefore(player: IPlayer): IPlayer {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex === -1) {
      throw new Error(`Player ${player.id} not in game ${this.id}`);
    }

    // Go to the end of the array if stand at the start
    return this.players[(playerIndex === 0) ? this.players.length - 1 : playerIndex - 1];
  }

  public getPlayerAfter(player: IPlayer): IPlayer {
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
      const corporation = player.corporations.map(toName).join('|');
      const vpb = player.getVictoryPoints();
      scores.push({corporation: corporation, playerScore: vpb.total});
    });

    Database.getInstance().saveGameResults(this.id, this.players.length, this.generation, this.gameOptions, scores);
    this.phase = Phase.END;
    const gameLoader = GameLoader.getInstance();
    await gameLoader.saveGame(this);
    gameLoader.completeGame(this);
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
      player.onGlobalParameterIncrease(GlobalParameter.OXYGEN, steps);
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
      player.playedCards.forEach((card) => card.onGlobalParameterIncrease?.(player, GlobalParameter.VENUS, steps));
      TurmoilHandler.onGlobalParameterIncrease(player, GlobalParameter.VENUS, steps);
      player.onGlobalParameterIncrease(GlobalParameter.VENUS, steps);
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
      player.onGlobalParameterIncrease(GlobalParameter.TEMPERATURE, steps);
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

    if (space.tile !== undefined) {
      let allow = false;
      if (tile.tileType === TileType.NEW_HOLLAND) {
        allow = true;
      } else if (this.gameOptions.aresExtension) {
        allow = true;
      } else if (this.gameOptions.pathfindersExpansion) {
        allow = true;
      }
      if (!allow) {
        throw new Error('Selected space is occupied');
      }
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
    const initialTileType = space.tile?.tileType;
    const coveringExistingTile = space.tile !== undefined;
    const arcadianCommunityBonus = space.player === player && player.isCorporation(CardName.ARCADIAN_COMMUNITIES);

    // Part 4. Place the tile
    this.simpleAddTile(player, space, tile);

    // Part 5. Collect the bonuses
    if (this.phase !== Phase.SOLAR) {
      this.grantPlacementBonuses(player, space, coveringExistingTile, arcadianCommunityBonus);

      AresHandler.ifAres(this, (aresData) => {
        AresHandler.maybeIncrementMilestones(aresData, player, space, hazardSeverity(initialTileType));
      });
    } else {
      space.player = undefined;
    }

    this.players.forEach((p) => {
      p.tableau.forEach((playedCard) => {
        playedCard.onTilePlaced?.(p, player, space, BoardType.MARS);
      });
    });

    if (initialTileType !== undefined) {
      AresHandler.ifAres(this, () => {
        AresHandler.grantBonusForRemovingHazard(player, initialTileType);
      });
    }

    if (this.gameOptions.underworldExpansion) {
      if (space.spaceType !== SpaceType.COLONY && space.player === player) {
        UnderworldExpansion.identify(this, space, player, 'tile');
      }
    }
  }

  public grantPlacementBonuses(player: IPlayer, space: Space, coveringExistingTile: boolean = false, arcadianCommunityBonus: boolean = false) {
    if (!coveringExistingTile) {
      this.grantSpaceBonuses(player, space);
    }

    this.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
      if (Board.isOceanSpace(adjacentSpace)) {
        player.megaCredits += player.oceanBonus;
      }
    });

    // TODO(kberg): these might not apply for some bonuses, e.g. Frontier Town.
    // https://boardgamegeek.com/thread/3344366/article/44658730#44658730
    if (space.tile !== undefined) {
      AresHandler.ifAres(this, () => {
        AresHandler.earnAdjacencyBonuses(player, space);
      });

      TurmoilHandler.resolveTilePlacementBonuses(player, space.spaceType);

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
        this.defer(new SelectPaymentDeferred(
          player,
          constants.VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST,
          {title: 'Select how to pay for placement bonus temperature'}))
          .andThen(() => this.increaseTemperature(player, 1));
      }
      break;
    case SpaceBonus.ENERGY:
      player.stock.add(Resource.ENERGY, count, {log: true});
      break;
    case SpaceBonus.ASTEROID:
      this.defer(new AddResourcesToCard(player, CardResource.ASTEROID, {count: count}));
      break;
    case SpaceBonus.DELEGATE:
      Turmoil.ifTurmoil(this, () => this.defer(new SendDelegateToArea(player)));
      break;
    case SpaceBonus.COLONY:
      this.defer(new SelectPaymentDeferred(
        player,
        constants.TERRA_CIMMERIA_COLONY_COST,
        {title: 'Select how to pay for building a colony'}))
        .andThen(() => this.defer(new BuildColony(player)));
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
      player.onGlobalParameterIncrease(GlobalParameter.OCEANS, 1);
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
    if (this.playersInGenerationOrder.length === 0) {
      const e = [...this.players, ...this.players];
      const idx = e.findIndex((p) => p.id === this.first.id);
      this.playersInGenerationOrder = e.slice(idx, idx + this.players.length);
    }
    return this.playersInGenerationOrder;
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

  public getStandardProjects(): Array<IStandardProjectCard> {
    const gameOptions = this.gameOptions;
    return new GameCards(gameOptions)
      .getStandardProjects()
      .filter((card) => {
        switch (card.name) {
        // sell patents is not displayed as a card
        case CardName.SELL_PATENTS_STANDARD_PROJECT:
          return false;
          // For buffer gas, show ONLY IF in solo AND 63TR mode
        case CardName.BUFFER_GAS_STANDARD_PROJECT:
          return this.isSoloMode() && gameOptions.soloTR;
        case CardName.AIR_SCRAPPING_STANDARD_PROJECT:
          return gameOptions.altVenusBoard === false;
        case CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT:
          return gameOptions.altVenusBoard === true;
        case CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_2:
        case CardName.MOON_MINE_STANDARD_PROJECT_VARIANT_2:
        case CardName.MOON_ROAD_STANDARD_PROJECT_VARIANT_2:
          return gameOptions.moonStandardProjectVariant === true;
        case CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_1:
        case CardName.MOON_MINE_STANDARD_PROJECT_VARIANT_1:
        case CardName.MOON_ROAD_STANDARD_PROJECT_VARIANT_1:
          return gameOptions.moonStandardProjectVariant1 === true;
        case CardName.EXCAVATE_STANDARD_PROJECT:
          return gameOptions.underworldExpansion === true;
        case CardName.COLLUSION_STANDARD_PROJECT:
          return gameOptions.underworldExpansion === true && gameOptions.turmoilExtension === true;
        default:
          return true;
        }
      })
      .sort((a, b) => a.cost - b.cost);
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

  public getSpaceByOffset(direction: 'top' | 'bottom', toPlace: TileType, cardCount: 1 | 2 = 1) {
    const cost = this.discardForCost(cardCount, toPlace);

    const distance = Math.max(cost - 1, 0); // Some cards cost zero.
    const space = this.board.getNthAvailableLandSpace(distance, direction,
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
          return this.nomadSpace !== space.id;
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
    const days = stringToNumber(process.env.MAX_GAME_DAYS, 10);
    return addDays(this.createdTime, days).getTime();
  }

  public static deserialize(d: SerializedGame): Game {
    // TODO(kberg): Remove by 2025-08-01
    if (d.gameOptions.expansions === undefined) {
      d.gameOptions.expansions = {
        corpera: d.gameOptions.corporateEra,
        venus: d.gameOptions.venusNextExtension,
        colonies: d.gameOptions.coloniesExtension,
        prelude: d.gameOptions.preludeExtension,
        prelude2: d.gameOptions.prelude2Expansion,
        turmoil: d.gameOptions.turmoilExtension,
        promo: d.gameOptions.promoCardsOption,
        community: d.gameOptions.communityCardsOption,
        ares: d.gameOptions.aresExtension,
        moon: d.gameOptions.moonExpansion,
        pathfinders: d.gameOptions.pathfindersExpansion,
        ceo: d.gameOptions.ceoExtension,
        starwars: d.gameOptions.starWarsExpansion,
        underworld: d.gameOptions.underworldExpansion,
      };
    }
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

    // TODO(kberg): remove || [] after 2025-06-01
    const game = new Game(d.id, players, first, d.activePlayer, gameOptions, rng, board, projectDeck, corporationDeck, preludeDeck, ceoDeck, d.tags || []);
    game.resettable = true;
    game.spectatorId = d.spectatorId;
    game.createdTime = new Date(d.createdTimeMs);

    const milestones: Array<IMilestone> = [];
    d.milestones.forEach((milestoneName) => {
      milestoneName = maybeRenamedMilestone(milestoneName);
      const milestone = milestoneManifest.create(milestoneName);
      if (milestone !== undefined) {
        milestones.push(milestone);
      }
    });

    game.milestones = milestones;
    game.claimedMilestones = deserializeClaimedMilestones(d.claimedMilestones, players, milestones);

    const awards: Array<IAward> = [];
    d.awards.forEach((awardName) => {
      awardName = maybeRenamedAward(awardName);
      const award = awardManifest.create(awardName);
      if (award !== undefined) {
        awards.push(award);
      }
    });

    game.awards = awards;
    game.fundedAwards = deserializeFundedAwards(d.fundedAwards, players, awards);

    if (gameOptions.aresExtension) {
      game.aresData = deserializeAresData(d.aresData);
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
    game.verminInEffect = d.verminInEffect ?? false; // TODO(kberg): remove ?? false by 2025-08-01
    // Still in Draft or Research of generation 1
    if (game.generation === 1 && players.some((p) => p.corporations.length === 0)) {
      if (game.phase === Phase.INITIALDRAFTING) {
        if (game.initialDraftIteration === 3) {
          newPreludeDraft(game).restoreDraft();
        } else {
          newInitialDraft(game).restoreDraft();
        }
      } else {
        game.gotoInitialResearchPhase();
      }
    } else if (game.phase === Phase.DRAFTING) {
      newStandardDraft(game).restoreDraft();
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
