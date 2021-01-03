import * as constants from './constants';
import {AndOptions} from './inputs/AndOptions';
import {BeginnerCorporation} from './cards/corporation/BeginnerCorporation';
import {Board} from './boards/Board';
import {BoardName} from './boards/BoardName';
import {CardFinder} from './CardFinder';
import {CardName} from './CardName';
import {CardType} from './cards/CardType';
import {ClaimedMilestone, serializeClaimedMilestones, deserializeClaimedMilestones} from './milestones/ClaimedMilestone';
import {Colony} from './colonies/Colony';
import {ColonyDealer, loadColoniesFromJSON} from './colonies/ColonyDealer';
import {ColonyModel} from './models/ColonyModel';
import {ColonyName} from './colonies/ColonyName';
import {Color} from './Color';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {Database} from './database/Database';
import {Dealer} from './Dealer';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {FundedAward, serializeFundedAwards, deserializeFundedAwards} from './awards/FundedAward';
import {HellasBoard} from './boards/HellasBoard';
import {IAward} from './awards/IAward';
import {ISerializable} from './ISerializable';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {ISpace} from './boards/ISpace';
import {ITile} from './ITile';
import {LogBuilder} from './LogBuilder';
import {LogHelper} from './LogHelper';
import {LogMessage} from './LogMessage';
import {ALL_MILESTONES} from './milestones/Milestones';
import {ALL_AWARDS} from './awards/Awards';
import {OriginalBoard} from './boards/OriginalBoard';
import {PartyHooks} from './turmoil/parties/PartyHooks';
import {Phase} from './Phase';
import {Player, PlayerId} from './Player';
import {PlayerInput} from './PlayerInput';
import {ResourceType} from './ResourceType';
import {Resources} from './Resources';
import {SelectCard} from './inputs/SelectCard';
import {DeferredAction} from './deferredActions/DeferredAction';
import {DeferredActionsQueue} from './deferredActions/DeferredActionsQueue';
import {SelectHowToPayDeferred} from './deferredActions/SelectHowToPayDeferred';
import {PlaceOceanTile} from './deferredActions/PlaceOceanTile';
import {RemoveColonyFromGame} from './deferredActions/RemoveColonyFromGame';
import {SelectSpace} from './inputs/SelectSpace';
import {SerializedGame} from './SerializedGame';
import {SerializedPlayer} from './SerializedPlayer';
import {SpaceBonus} from './SpaceBonus';
import {SpaceName} from './SpaceName';
import {SpaceType} from './SpaceType';
import {Tags} from './cards/Tags';
import {TileType} from './TileType';
import {Turmoil} from './turmoil/Turmoil';
import {RandomMAOptionType} from './RandomMAOptionType';
import {AresHandler} from './ares/AresHandler';
import {IAresData} from './ares/IAresData';
import {Multiset} from './utils/Multiset';
import {GameSetup} from './GameSetup';
import {CardLoader} from './CardLoader';
import {GlobalParameter} from './GlobalParameter';
import {AresSetup} from './ares/AresSetup';

export type GameId = string;

export interface Score {
  corporation: String;
  playerScore: number;
}

export interface GameOptions {
  boardName: BoardName;
  clonedGamedId: GameId | undefined;

  // Configuration
  undoOption: boolean;
  showTimers: boolean;
  fastModeOption: boolean;
  showOtherPlayersVP: boolean;

  // Extensions
  corporateEra: boolean;
  venusNextExtension: boolean;
  coloniesExtension: boolean;
  preludeExtension: boolean;
  turmoilExtension: boolean;
  promoCardsOption: boolean;
  communityCardsOption: boolean;
  aresExtension: boolean;
  aresHazards: boolean;
  solarPhaseOption: boolean;
  removeNegativeGlobalEventsOption: boolean;
  includeVenusMA: boolean;

  // Variants
  draftVariant: boolean;
  initialDraftVariant: boolean;
  startingCorporations: number;
  shuffleMapOption: boolean;
  randomMA: RandomMAOptionType;
  soloTR: boolean; // Solo victory by getting TR 63 by game end
  customCorporationsList: Array<CardName>;
  cardsBlackList: Array<CardName>;
  customColoniesList: Array<ColonyName>;
  requiresVenusTrackCompletion: boolean; // Venus must be completed to end the game
}

const DEFAULT_GAME_OPTIONS: GameOptions = {
  aresExtension: false,
  aresHazards: true,
  boardName: BoardName.ORIGINAL,
  cardsBlackList: [],
  clonedGamedId: undefined,
  coloniesExtension: false,
  communityCardsOption: false,
  corporateEra: true,
  customColoniesList: [],
  customCorporationsList: [],
  draftVariant: false,
  fastModeOption: false,
  includeVenusMA: true,
  initialDraftVariant: false,
  preludeExtension: false,
  promoCardsOption: false,
  randomMA: RandomMAOptionType.NONE,
  removeNegativeGlobalEventsOption: false,
  requiresVenusTrackCompletion: false,
  showOtherPlayersVP: false,
  showTimers: false,
  shuffleMapOption: false,
  solarPhaseOption: false,
  soloTR: false,
  startingCorporations: 2,
  turmoilExtension: false,
  undoOption: false,
  venusNextExtension: false,
};

export class Game implements ISerializable<SerializedGame> {
  // Game-level data
  public lastSaveId: number = 0;
  private clonedGamedId: string | undefined;
  public seed: number;
  public deferredActions: DeferredActionsQueue = new DeferredActionsQueue();
  public gameAge: number = 0; // Each log event increases it
  public gameLog: Array<LogMessage> = [];

  public generation: number = 1;
  public phase: Phase = Phase.RESEARCH;
  public dealer: Dealer;
  public board: Board;

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

  // Drafting
  private draftRound: number = 1;
  private initialDraftIteration: number = 1;
  private unDraftedCards: Map<PlayerId, Array<IProjectCard>> = new Map();

  // Milestones and awards
  public claimedMilestones: Array<ClaimedMilestone> = [];
  public milestones: Array<IMilestone> = [];
  public fundedAwards: Array<FundedAward> = [];
  public awards: Array<IAward> = [];

  // Expansion-specific data
  public colonies: Array<Colony> = [];
  public colonyDealer: ColonyDealer | undefined = undefined;
  public turmoil: Turmoil | undefined;
  public aresData: IAresData | undefined;

  // Card-specific data
  // Mons Insurance promo corp
  public monsInsuranceOwner: PlayerId | undefined = undefined;
  // Crash Site promo project
  public someoneHasRemovedOtherPlayersPlants: boolean = false;

  private constructor(
    public id: GameId,
    private players: Array<Player>,
    private first: Player,
    activePlayer: PlayerId,
    public gameOptions: GameOptions,
    seed: number,
    board: Board,
    dealer: Dealer) {
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
    this.seed = seed;
    this.dealer = dealer;
    this.board = board;
  }

  public static newInstance(id: GameId,
    players: Array<Player>,
    first: Player,
    gameOptions: GameOptions = {...DEFAULT_GAME_OPTIONS}): Game {
    const seed = Math.random();
    const board = GameSetup.newBoard(gameOptions.boardName, gameOptions.shuffleMapOption, seed, gameOptions.venusNextExtension);
    const cardFinder = new CardFinder();
    const cardLoader = new CardLoader(gameOptions);
    const dealer = Dealer.newInstance(cardLoader);

    const activePlayer = first.id;

    const game: Game = new Game(id, players, first, activePlayer, gameOptions, seed, board, dealer);

    // Clone game
    if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
      throw new Error('Clone game disabled temporarily. Should be restored in January.');
    //   game.cloneGame(gameOptions.clonedGamedId);
    //   game.clonedGamedId = '#' + gameOptions.clonedGamedId;
    //   return game;
    }

    // Initialize Ares data
    if (gameOptions.aresExtension) {
      game.aresData = AresSetup.initialData(gameOptions.aresExtension, gameOptions.aresHazards, players);
    }

    // Single player game player starts with 14TR
    // and 2 neutral cities and forests on board
    if (players.length === 1) {
      gameOptions.draftVariant = false;
      gameOptions.initialDraftVariant = false;
      gameOptions.randomMA = RandomMAOptionType.NONE;
      game.setupSolo();
    }

    const milestonesAwards = GameSetup.chooseMilestonesAndAwards(gameOptions);
    game.milestones = milestonesAwards.milestones;
    game.awards = milestonesAwards.awards;

    // Add colonies stuff
    if (gameOptions.coloniesExtension) {
      game.colonyDealer = new ColonyDealer();
      const communityColoniesSelected = GameSetup.includesCommunityColonies(gameOptions);
      const allowCommunityColonies = gameOptions.communityCardsOption || communityColoniesSelected;

      game.colonies = game.colonyDealer.drawColonies(players.length, gameOptions.customColoniesList, gameOptions.venusNextExtension, gameOptions.turmoilExtension, allowCommunityColonies);
      if (players.length === 1) {
        players[0].addProduction(Resources.MEGACREDITS, -2);
        game.defer(new RemoveColonyFromGame(players[0], game));
      }
    }

    // Add Turmoil stuff
    if (gameOptions.turmoilExtension) {
      game.turmoil = Turmoil.newInstance(game);
    }

    // Setup Ares hazards
    if (gameOptions.aresExtension && gameOptions.aresHazards) {
      AresSetup.setupHazards(game, players.length);
    }

    // Setup custom corporation list
    let corporationCards = game.dealer.corporationCards;

    const minCorpsRequired = players.length * gameOptions.startingCorporations;
    if (gameOptions.customCorporationsList && gameOptions.customCorporationsList.length >= minCorpsRequired) {
      const customCorporationCards: CorporationCard[] = [];
      for (const corp of gameOptions.customCorporationsList) {
        const customCorp = cardFinder.getCorporationCardByName(corp);
        if (customCorp) customCorporationCards.push(customCorp);
      }
      corporationCards = customCorporationCards;
    }

    corporationCards = dealer.shuffleCards(corporationCards);

    // Failsafe for exceding corporation pool
    if (gameOptions.startingCorporations * players.length > corporationCards.length) {
      gameOptions.startingCorporations = 2;
    }

    // Initialize each player:
    // Give them their corporation cards, other cards, starting production,
    // handicaps.
    for (const player of game.getPlayers()) {
      player.increaseTerraformRatingSteps(player.handicap, game);
      if (!gameOptions.corporateEra) {
        GameSetup.setStartingProductions(player);
      }

      if (!player.beginner ||
      // Bypass beginner choice if any extension is choosen
            gameOptions.preludeExtension ||
            gameOptions.venusNextExtension ||
            gameOptions.coloniesExtension ||
            gameOptions.turmoilExtension ||
            gameOptions.initialDraftVariant) {
        for (let i = 0; i < gameOptions.startingCorporations; i++) {
          const corpCard = corporationCards.pop();
          if (corpCard !== undefined) {
            player.dealtCorporationCards.push(corpCard);
          } else {
            throw new Error('No corporation card dealt for player');
          }
        }
        if (gameOptions.initialDraftVariant === false) {
          for (let i = 0; i < 10; i++) {
            player.dealtProjectCards.push(dealer.dealCard());
          }
        }
        if (gameOptions.preludeExtension) {
          for (let i = 0; i < 4; i++) {
            player.dealtPreludeCards.push(dealer.dealPreludeCard());
          }
        }
      } else {
        game.playerHasPickedCorporationCard(player, new BeginnerCorporation());
      }
    }

    // Print game_id if solo game
    if (players.length === 1) {
      game.log('The id of this game is ${0}', (b) => b.rawString(id));
    }

    game.log('Generation ${0}', (b) => b.forNewGeneration().number(game.generation));

    // Initial Draft
    if (gameOptions.initialDraftVariant) {
      game.runDraftRound(true);
    } else {
      game.gotoInitialResearchPhase();
    }

    return game;
  }

  public save(): void {
    Database.getInstance().saveGame(this);
  }

  public toJSON(): string {
    return JSON.stringify(this.serialize());
  }

  public serialize(): SerializedGame {
    const result: SerializedGame = {
      activePlayer: this.activePlayer,
      awards: this.awards,
      board: this.board.serialize(),
      claimedMilestones: serializeClaimedMilestones(this.claimedMilestones),
      colonies: this.colonies,
      colonyDealer: this.colonyDealer,
      dealer: this.dealer.serialize(),
      deferredActions: [],
      donePlayers: Array.from(this.donePlayers),
      draftedPlayers: Array.from(this.draftedPlayers),
      draftRound: this.draftRound,
      first: this.first.id,
      fundedAwards: serializeFundedAwards(this.fundedAwards),
      gameAge: this.gameAge,
      gameLog: this.gameLog,
      gameOptions: this.gameOptions,
      generation: this.generation,
      id: this.id,
      initialDraftIteration: this.initialDraftIteration,
      lastSaveId: this.lastSaveId,
      milestones: this.milestones,
      monsInsuranceOwner: this.monsInsuranceOwner,
      oxygenLevel: this.oxygenLevel,
      passedPlayers: Array.from(this.passedPlayers),
      phase: this.phase,
      players: this.players.map((p) => p.serialize()),
      researchedPlayers: Array.from(this.researchedPlayers),
      seed: this.seed,
      someoneHasRemovedOtherPlayersPlants: this.someoneHasRemovedOtherPlayersPlants,
      temperature: this.temperature,
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
  public getPlayerById(id: string): Player {
    const player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      throw new Error(`player ${id} does not exist on game ${this.id}`);
    }
    return player;
  }

  // Function to return an array of players from an array of player ids
  public getPlayersById(ids: Array<string>): Array<Player> {
    return ids.map((id) => this.getPlayerById(id));
  }

  // private cloneGame(gameId: GameId): void {
  //   Database.getInstance().restoreReferenceGame(gameId, function(err, game) {
  //     try {
  //       if (err) {
  //         throw new Error('Game ' + gameId + ' not found');
  //       }
  //       // Check number of players
  //       if (game.players.length !== gameToRebuild.players.length) {
  //         throw new Error('Player number mismatch');
  //       }
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         console.log('Clone game error: ' + e.message);
  //         // Revert to game creation screen with error message
  //         return;
  //       }
  //     }

  //     // Update game options
  //     game.gameOptions = gameToRebuild.gameOptions;
  //     game.board = gameToRebuild.board;

  //     // Update dealers
  //     game.dealer = gameToRebuild.dealer;
  //     game.colonyDealer = gameToRebuild.colonyDealer;

  //     // Update other objects
  //     game.milestones = gameToRebuild.milestones;
  //     game.awards = gameToRebuild.awards;
  //     game.colonies = gameToRebuild.colonies;
  //     game.turmoil = gameToRebuild.turmoil;

  //     // Set active player
  //     const playerIndex = gameToRebuild.players.indexOf(gameToRebuild.first);
  //     game.first = game.players[playerIndex];
  //     game.activePlayer = game.players[playerIndex].id;

  //     // Recreate turmoil lobby and reserve (Turmoil stores some players ids)
  //     if (gameToRebuild.gameOptions.turmoilExtension && game.turmoil !== undefined) {
  //       game.turmoil.lobby.clear();
  //       game.turmoil.delegateReserve = [];
  //       game.getPlayers().forEach((player) => {
  //         if (game.turmoil !== undefined) {
  //           game.turmoil.lobby.add(player.id);
  //           for (let i = 0; i < 6; i++) {
  //             game.turmoil.delegateReserve.push(player.id);
  //           }
  //         }
  //       });
  //       for (let i = 0; i < 13; i++) {
  //         game.turmoil.delegateReserve.push('NEUTRAL');
  //       }
  //     }

  //     // Update Players
  //     game.players.forEach((player) => {
  //       const playerIndex = game.players.indexOf(player);
  //       const referencePlayer = gameToRebuild.players[playerIndex];
  //       player.dealtCorporationCards = referencePlayer.dealtCorporationCards;
  //       player.dealtPreludeCards = referencePlayer.dealtPreludeCards;
  //       player.dealtProjectCards = referencePlayer.dealtProjectCards;
  //       player.setTerraformRating(referencePlayer.getTerraformRating());

  //       // Special case solo play and Colonies
  //       if (game.players.length === 1 && game.gameOptions.coloniesExtension) {
  //         player.addProduction(Resources.MEGACREDITS, -2);
  //         game.defer(new RemoveColonyFromGame(player, game));
  //       }
  //     });

  //     // Initial Draft
  //     if (game.gameOptions.initialDraftVariant) {
  //       game.runDraftRound(true);
  //     } else {
  //       game.gotoInitialResearchPhase();
  //     }
  //   });
  // }

  public defer(action: DeferredAction, priority: boolean = false): void {
    if (priority) {
      this.deferredActions.unshift(action);
    } else {
      this.deferredActions.push(action);
    }
  }

  public getColoniesModel(colonies: Array<Colony>) : Array<ColonyModel> {
    return colonies.map(
      (colony): ColonyModel => ({
        colonies: colony.colonies.map(
          (playerId): Color => this.getPlayerById(playerId).color,
        ),
        isActive: colony.isActive,
        name: colony.name,
        trackPosition: colony.trackPosition,
        visitor:
              colony.visitor === undefined ?
                undefined :
                this.getPlayerById(colony.visitor).color,
      }),
    );
  }

  public milestoneClaimed(milestone: IMilestone): boolean {
    return this.claimedMilestones.find(
      (claimedMilestone) => claimedMilestone.milestone === milestone,
    ) !== undefined;
  }

  public noOceansAvailable(): boolean {
    return this.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES;
  }

  private marsIsTerraformed(): boolean {
    const oxygenMaxed = this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL;
    const temperatureMaxed = this.temperature >= constants.MAX_TEMPERATURE;
    const oceansMaxed = this.board.getOceansOnBoard() === constants.MAX_OCEAN_TILES;
    const globalParametersMaxed = oxygenMaxed && temperatureMaxed && oceansMaxed;
    const venusMaxed = this.getVenusScaleLevel() === constants.MAX_VENUS_SCALE;

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

  public isSoloModeWin(): boolean {
    // Solo TR
    if (this.gameOptions.soloTR) {
      return this.players[0].getTerraformRating() >= 63;
    }
    if ( ! this.marsIsTerraformed()) return false;
    return this.gameOptions.preludeExtension ? this.generation <= 12 : this.generation <= 14;
  }

  public getAwardFundingCost(): number {
    return 8 + (6 * this.fundedAwards.length);
  }

  public fundAward(player: Player, award: IAward): void {
    if (this.allAwardsFunded()) {
      throw new Error('All awards already funded');
    }
    this.log('${0} funded ${1} award',
      (b) => b.player(player).award(award));

    this.fundedAwards.push({
      award: award,
      player: player,
    });
  }

  public hasBeenFunded(award: IAward): boolean {
    return this.fundedAwards.find(
      (fundedAward) => fundedAward.award === award,
    ) !== undefined;
  }

  public allAwardsFunded(): boolean {
    // Awards are disabled for 1 player games
    if (this.players.length === 1) return true;

    return this.fundedAwards.length > 2;
  }

  public allMilestonesClaimed(): boolean {
    // Milestones are disabled for 1 player games
    if (this.players.length === 1) return true;

    return this.claimedMilestones.length > 2;
  }

  private playerHasPickedCorporationCard(player: Player, corporationCard: CorporationCard) {
    player.pickedCorporationCard = corporationCard;
    // if all players picked corporationCard
    if (this.players.every((p) => p.pickedCorporationCard !== undefined)) {
      for (const somePlayer of this.getPlayers()) {
        this.playCorporationCard(somePlayer, somePlayer.pickedCorporationCard!);
      }
    }
  }

  private playCorporationCard(
    player: Player, corporationCard: CorporationCard,
  ): void {
    player.corporationCard = corporationCard;
    player.megaCredits = corporationCard.startingMegaCredits;
    if (corporationCard.cardCost !== undefined) {
      player.cardCost = corporationCard.cardCost;
    }

    if (corporationCard.name !== CardName.BEGINNER_CORPORATION) {
      player.megaCredits -= player.cardsInHand.length * player.cardCost;
    }
    corporationCard.play(player, this);
    this.log('${0} played ${1}', (b) => b.player(player).card(corporationCard));

    // trigger other corp's effect, e.g. SaturnSystems,PharmacyUnion,Splice
    for (const somePlayer of this.getPlayers()) {
      if (somePlayer !== player && somePlayer.corporationCard !== undefined && somePlayer.corporationCard.onCorpCardPlayed !== undefined) {
        this.defer(new DeferredAction(
          player,
          () => {
            if (somePlayer.corporationCard !== undefined && somePlayer.corporationCard.onCorpCardPlayed !== undefined) {
              return somePlayer.corporationCard.onCorpCardPlayed(player, this, corporationCard) || undefined;
            }
            return undefined;
          },
        ));
      }
    }

    // Activate some colonies
    if (this.gameOptions.coloniesExtension && corporationCard.resourceType !== undefined) {
      this.colonies.forEach((colony) => {
        if (colony.resourceType !== undefined && colony.resourceType === corporationCard.resourceType) {
          colony.isActive = true;
        }
      });

      // Check for Venus colony
      if (corporationCard.tags.includes(Tags.VENUS)) {
        const venusColony = this.colonies.find((colony) => colony.name === ColonyName.VENUS);
        if (venusColony) venusColony.isActive = true;
      }
    }

    this.playerIsFinishedWithResearchPhase(player);
  }

  private pickCorporationCard(player: Player): PlayerInput {
    let corporation: CorporationCard;
    const result: AndOptions = new AndOptions(() => {
      // Check for negative M€
      const cardCost = corporation.cardCost !== undefined ? corporation.cardCost : player.cardCost;
      if (corporation.name !== CardName.BEGINNER_CORPORATION && player.cardsInHand.length * cardCost > corporation.startingMegaCredits) {
        player.cardsInHand = [];
        player.preludeCardsInHand = [];
        throw new Error('Too many cards selected');
      }
      // discard all unpurchased cards
      player.dealtProjectCards.forEach((card) => {
        if (player.cardsInHand.includes(card) === false) {
          this.dealer.discard(card);
        }
      });

      this.playerHasPickedCorporationCard(player, corporation); return undefined;
    });

    result.title = ' ';
    result.buttonLabel = 'Start';

    result.options.push(
      new SelectCard<CorporationCard>(
        'Select corporation', undefined, player.dealtCorporationCards,
        (foundCards: Array<CorporationCard>) => {
          corporation = foundCards[0];
          return undefined;
        },
      ),
    );

    if (this.gameOptions.preludeExtension) {
      result.options.push(
        new SelectCard(
          'Select 2 Prelude cards', undefined, player.dealtPreludeCards,
          (preludeCards: Array<IProjectCard>) => {
            player.preludeCardsInHand.push(...preludeCards);
            return undefined;
          }, 2, 2,
        ),
      );
    }

    result.options.push(
      new SelectCard(
        'Select initial cards to buy', undefined, player.dealtProjectCards,
        (foundCards: Array<IProjectCard>) => {
          player.cardsInHand.push(...foundCards);
          return undefined;
        }, 10, 0,
      ),
    );
    return result;
  }

  public hasPassedThisActionPhase(player: Player): boolean {
    return this.passedPlayers.has(player.id);
  }

  private incrementFirstPlayer(): void {
    let firstIndex: number = this.players.map(function(x) {
      return x.id;
    }).indexOf(this.first.id);
    if (firstIndex === -1) {
      throw new Error('Didn\'t even find player');
    }
    if (firstIndex === this.players.length - 1) {
      firstIndex = 0;
    } else {
      firstIndex++;
    }
    this.first = this.players[firstIndex];
  }

  private runDraftRound(initialDraft: boolean = false, preludeDraft: boolean = false): void {
    this.save();
    this.draftedPlayers.clear();
    this.players.forEach((player) => {
      player.needsToDraft = true;
      if (this.draftRound === 1 && !preludeDraft) {
        player.runDraftPhase(initialDraft, this, this.getNextDraft(player).name);
      } else if (this.draftRound === 1 && preludeDraft) {
        player.runDraftPhase(initialDraft, this, this.getNextDraft(player).name, player.dealtPreludeCards);
      } else {
        const cards = this.unDraftedCards.get(this.getDraftCardsFrom(player));
        this.unDraftedCards.delete(this.getDraftCardsFrom(player));
        player.runDraftPhase(initialDraft, this, this.getNextDraft(player).name, cards);
      }
    });
  }

  private gotoInitialResearchPhase(): void {
    this.save();
    for (const player of this.players) {
      if (player.pickedCorporationCard === undefined && player.dealtCorporationCards.length > 0) {
        player.setWaitingFor(this.pickCorporationCard(player), () => {});
      }
    }
  }

  private gotoResearchPhase(): void {
    this.phase = Phase.RESEARCH;
    this.researchedPlayers.clear();
    this.save();
    this.players.forEach((player) => {
      player.runResearchPhase(this, this.gameOptions.draftVariant);
    });
  }

  private gotoDraftingPhase(): void {
    this.phase = Phase.DRAFTING;
    this.draftRound = 1;
    this.runDraftRound();
  }

  public gameIsOver(): boolean {
    // Single player game is done after generation 14 or 12 with prelude
    if (this.isSoloMode()) {
      // Solo mode must go on until 14 or 12 generation even if Mars is already terraformed
      return this.generation === 14 || (this.generation === 12 && this.gameOptions.preludeExtension);
    }
    return this.marsIsTerraformed();
  }

  private gotoProductionPhase(): void {
    this.phase = Phase.PRODUCTION;
    this.passedPlayers.clear();
    this.someoneHasRemovedOtherPlayersPlants = false;
    this.players.forEach((player) => {
      player.cardDiscount = 0; // Iapetus reset hook
      player.runProductionPhase();
    });

    if (this.gameIsOver()) {
      this.gotoFinalGreeneryPlacement();
      // Log id or cloned game id
      if (this.clonedGamedId !== undefined && this.clonedGamedId.startsWith('#')) {
        this.log('This game was a clone from game ' + this.clonedGamedId);
      } else {
        this.log('This game id was ' + this.id);
      }
      return;
    }

    // solar Phase Option
    this.phase = Phase.SOLAR;
    if (this.gameOptions.solarPhaseOption && ! this.marsIsTerraformed()) {
      this.gotoWorldGovernmentTerraforming();
      return;
    }
    this.gotoEndGeneration();
  }

  private gotoEndGeneration() {
    if (this.gameOptions.coloniesExtension) {
      this.colonies.forEach((colony) => {
        colony.endGeneration();
      });
    }

    if (this.gameOptions.turmoilExtension) {
      this.turmoil?.endGeneration(this);
    }

    // Resolve Turmoil deferred actions
    if (this.deferredActions.length > 0) {
      this.resolveTurmoilDeferredActions();
      return;
    }

    this.phase = Phase.INTERGENERATION;
    this.goToDraftOrResearch();
  }

  private resolveTurmoilDeferredActions() {
    this.deferredActions.runAll(() => this.goToDraftOrResearch());
  }

  private goToDraftOrResearch() {
    this.generation++;
    this.log('Generation ${0}', (b) => b.forNewGeneration().number(this.generation));
    this.incrementFirstPlayer();

    this.players.forEach((player) => {
      player.terraformRatingAtGenerationStart = player.getTerraformRating();
      player.hasIncreasedTerraformRatingThisGeneration = false;
    });

    if (this.gameOptions.draftVariant) {
      this.gotoDraftingPhase();
    } else {
      this.gotoResearchPhase();
    }
  }

  private gotoWorldGovernmentTerraforming() {
    this.first.worldGovernmentTerraforming(this);
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

  public playerHasPassed(player: Player): void {
    this.passedPlayers.add(player.id);
  }

  private hasResearched(player: Player): boolean {
    return this.researchedPlayers.has(player.id);
  }

  private hasDrafted(player: Player): boolean {
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

  public playerIsFinishedWithResearchPhase(player: Player): void {
    this.researchedPlayers.add(player.id);
    if (this.allPlayersHaveFinishedResearch()) {
      this.deferredActions.runAll(() => this.gotoActionPhase());
    }
  }

  public playerIsFinishedWithDraftingPhase(initialDraft: boolean, player: Player, cards : Array<IProjectCard>): void {
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
      const lastCards = this.unDraftedCards.get(this.getDraftCardsFrom(player));
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
      this.gameOptions.initialDraftVariant = false;
      this.gotoInitialResearchPhase();
    }
  }

  private getDraftCardsFrom(player: Player): PlayerId {
    let nextPlayer: Player | undefined;

    // Change initial draft direction on second iteration
    if (this.generation === 1 && this.initialDraftIteration === 2) {
      nextPlayer = this.getPreviousPlayer(this.players, player);
    } else if (this.generation % 2 === 1) {
      nextPlayer = this.getNextPlayer(this.players, player);
    } else {
      nextPlayer = this.getPreviousPlayer(this.players, player);
    }

    if (nextPlayer !== undefined) {
      return nextPlayer.id;
    }
    return player.id;
  }

  private getNextDraft(player: Player): Player {
    let nextPlayer = this.getNextPlayer(this.players, player);
    if (this.generation%2 === 1) {
      nextPlayer = this.getPreviousPlayer(this.players, player);
    }
    // Change initial draft direction on second iteration
    if (this.initialDraftIteration === 2 && this.generation === 1) {
      nextPlayer = this.getNextPlayer(this.players, player);
    }

    if (nextPlayer !== undefined) {
      return nextPlayer;
    }
    return player;
  }

  private getPreviousPlayer(
    players: Array<Player>, player: Player,
  ): Player | undefined {
    const playerIndex: number = players.indexOf(player);

    // The player was not found
    if (playerIndex === -1) {
      return undefined;
    }

    // Go to the end of the array if stand at the start
    return players[(playerIndex === 0) ? players.length - 1 : playerIndex - 1];
  }

  private getNextPlayer(
    players: Array<Player>, player: Player,
  ): Player | undefined {
    const playerIndex: number = players.indexOf(player);

    // The player was not found
    if (playerIndex === -1) {
      return undefined;
    }

    // Go to the beginning of the array if we reached the end
    return players[(playerIndex + 1 >= players.length) ? 0 : playerIndex + 1];
  }


  public playerIsFinishedTakingActions(): void {
    // Deferred actions hook
    if (this.deferredActions.length > 0) {
      this.deferredActions.runAll(() => this.playerIsFinishedTakingActions());
      return;
    }

    if (this.allPlayersHavePassed()) {
      this.gotoProductionPhase();
      return;
    }

    const nextPlayer = this.getNextPlayer(this.players, this.getPlayerById(this.activePlayer));

    // Defensive coding to fail fast, if we don't find the next
    // player we are in an unexpected game state
    if (nextPlayer === undefined) {
      throw new Error('Did not find player');
    }

    if (!this.hasPassedThisActionPhase(nextPlayer)) {
      this.startActionsForPlayer(nextPlayer);
    } else {
      // Recursively find the next player
      this.activePlayer = nextPlayer.id;
      this.playerIsFinishedTakingActions();
    }
  }

  private gotoActionPhase(): void {
    this.phase = Phase.ACTION;
    this.passedPlayers.clear();
    this.startActionsForPlayer(this.first);
  }

  private gotoEndGame(): void {
    Database.getInstance().cleanSaves(this.id, this.lastSaveId);
    const scores: Array<Score> = [];
    this.players.forEach((player) => {
      let corponame: String = '';
      if (player.corporationCard !== undefined) {
        corponame = player.corporationCard.name;
      }
      scores.push({corporation: corponame, playerScore: player.victoryPointsBreakdown.total});
    });

    Database.getInstance().saveGameResults(this.id, this.players.length, this.generation, this.gameOptions, scores);
    if (this.phase === Phase.END) return;
    this.phase = Phase.END;
  }

  public canPlaceGreenery(player: Player): boolean {
    return !this.donePlayers.has(player.id) &&
            player.plants >= player.plantsNeededForGreenery &&
            this.board.getAvailableSpacesForGreenery(player).length > 0;
  }

  public playerIsDoneWithGame(player: Player): void {
    this.donePlayers.add(player.id);
    this.gotoFinalGreeneryPlacement();
  }

  private gotoFinalGreeneryPlacement(): void {
    const players = this.players.filter(
      (player) => this.canPlaceGreenery(player),
    );
    // If no players can place greeneries we are done
    if (players.length === 0) {
      this.gotoEndGame();
      return;
    }

    // iterate through players in order and allow them to convert plants
    // into greenery if possible, there needs to be spaces available for
    // greenery and the player needs enough plants
    let firstPlayer: Player | undefined = this.first;
    while (
      firstPlayer !== undefined && players.indexOf(firstPlayer) === -1
    ) {
      firstPlayer = this.getNextPlayer(this.players, firstPlayer);
    }

    if (firstPlayer !== undefined) {
      this.startFinalGreeneryPlacement(firstPlayer);
    } else {
      throw new Error('Was no player left to place final greenery');
    }
  }

  private startFinalGreeneryPlacement(player: Player) {
    this.activePlayer = player.id;
    player.takeActionForFinalGreenery(this);
  }

  private startActionsForPlayer(player: Player) {
    this.activePlayer = player.id;
    player.actionsTakenThisRound = 0;

    player.takeAction(this);
  }

  public increaseOxygenLevel(player: Player, increments: 1 | 2): undefined {
    if (this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL) {
      return undefined;
    }

    // Literal typing makes |increments| a const
    const steps = Math.min(increments, constants.MAX_OXYGEN_LEVEL - this.oxygenLevel);

    if (this.phase !== Phase.SOLAR) {
      player.increaseTerraformRatingSteps(steps, this);
    }
    if (this.oxygenLevel < 8 && this.oxygenLevel + steps >= 8) {
      this.increaseTemperature(player, 1);
    }

    this.oxygenLevel += steps;

    AresHandler.ifAres(this, (aresData) => {
      AresHandler.onOxygenChange(this, aresData);
    });

    return undefined;
  }

  public getOxygenLevel(): number {
    return this.oxygenLevel;
  }

  public increaseVenusScaleLevel(player: Player, increments: 1 | 2 | 3): SelectSpace | undefined {
    if (this.venusScaleLevel >= constants.MAX_VENUS_SCALE) {
      return undefined;
    }

    // Literal typing makes |increments| a const
    const steps = Math.min(increments, (constants.MAX_VENUS_SCALE - this.venusScaleLevel) / 2);

    if (this.phase !== Phase.SOLAR) {
      if (this.venusScaleLevel < 8 && this.venusScaleLevel + steps * 2 >= 8) {
        player.cardsInHand.push(this.dealer.dealCard());
      }
      if (this.venusScaleLevel < 16 && this.venusScaleLevel + steps * 2 >= 16) {
        player.increaseTerraformRating(this);
      }
      player.increaseTerraformRatingSteps(steps, this);
    }

    // Check for Aphrodite corporation
    const aphrodite = this.players.find((player) => player.isCorporation(CardName.APHRODITE));
    if (aphrodite !== undefined) {
      aphrodite.megaCredits += steps * 2;
    }

    this.venusScaleLevel += steps * 2;

    return undefined;
  }

  public getVenusScaleLevel(): number {
    return this.venusScaleLevel;
  }

  public increaseTemperature(player: Player, increments: -2 | 1 | 2 | 3): undefined {
    if (increments === -2) {
      this.temperature = Math.max(constants.MIN_TEMPERATURE, this.temperature + increments * 2);
      return undefined;
    }

    if (this.temperature >= constants.MAX_TEMPERATURE) {
      return undefined;
    }

    // Literal typing makes |increments| a const
    const steps = Math.min(increments, (constants.MAX_TEMPERATURE - this.temperature) / 2);

    if (this.phase !== Phase.SOLAR) {
      // BONUS FOR HEAT PRODUCTION AT -20 and -24
      if (this.temperature < -24 && this.temperature + steps * 2 >= -24) {
        player.addProduction(Resources.HEAT);
      }
      if (this.temperature < -20 && this.temperature + steps * 2 >= -20) {
        player.addProduction(Resources.HEAT);
      }

      player.increaseTerraformRatingSteps(steps, this);
    }

    // BONUS FOR OCEAN TILE AT 0
    if (this.temperature < 0 && this.temperature + steps * 2 >= 0) {
      this.defer(new PlaceOceanTile(player, this, 'Select space for ocean from temperature increase'));
    }

    this.temperature += steps * 2;

    AresHandler.ifAres(this, (aresData) => {
      AresHandler.onTemperatureChange(this, aresData);
    });

    return undefined;
  }

  public getTemperature(): number {
    return this.temperature;
  }

  public checkMinRequirements(player: Player, parameter: GlobalParameter, level: number): boolean {
    return this.checkRequirements(player, parameter, level);
  }

  public checkMaxRequirements(player: Player, parameter: GlobalParameter, level: number): boolean {
    return this.checkRequirements(player, parameter, level, true);
  }

  private checkRequirements(player: Player, parameter: GlobalParameter, level: number, max: boolean = false): boolean {
    let currentLevel: number;
    let playerRequirementsBonus: number = player.getRequirementsBonus(this, parameter === GlobalParameter.VENUS);

    if (parameter === GlobalParameter.OCEANS) {
      currentLevel = this.board.getOceansOnBoard();
    } else if (parameter === GlobalParameter.OXYGEN) {
      currentLevel = this.getOxygenLevel();
    } else if (parameter === GlobalParameter.TEMPERATURE) {
      currentLevel = this.getTemperature();
      playerRequirementsBonus *= 2;
    } else if (parameter === GlobalParameter.VENUS) {
      currentLevel = this.getVenusScaleLevel();
      playerRequirementsBonus *= 2;
    } else {
      console.warn(`Unknown GlobalParameter provided: ${parameter}`);
      return false;
    }

    if (max) {
      return currentLevel <= level + playerRequirementsBonus;
    } else {
      return currentLevel >= level - playerRequirementsBonus;
    }
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

  public getPlayer(name: string): Player {
    const player = this.players.find((player) => player.name === name);
    if (player === undefined) {
      throw new Error('Player not found');
    }
    return player;
  }

  public getSpace(id: string): ISpace {
    const space = this.board.spaces.find((space) => space.id === id);
    if (space === undefined) {
      throw new Error('Error with getting space');
    }
    return space;
  }
  public getCitiesInPlayOnMars(): number {
    return this.board.spaces.filter(
      (space) => Board.isCitySpace(space) && space.spaceType !== SpaceType.COLONY).length;
  }
  public getCitiesInPlay(): number {
    return this.board.spaces.filter((space) => Board.isCitySpace(space)).length;
  }
  public getSpaceCount(tileType: TileType, player: Player): number {
    return this.board.spaces.filter(
      (space) => space.tile !== undefined &&
                  space.tile.tileType === tileType &&
                  space.player !== undefined &&
                  space.player === player,
    ).length;
  }
  public addTile(
    player: Player, spaceType: SpaceType,
    space: ISpace, tile: ITile): void {
    // Part 1, basic validation checks.

    if (space.tile !== undefined && !this.gameOptions.aresExtension) {
      throw new Error('Selected space is occupied');
    }

    // Land claim a player can claim land for themselves
    if (space.player !== undefined && space.player !== player) {
      throw new Error('This space is land claimed by ' + space.player.name);
    }

    if (space.spaceType !== spaceType) {
      throw new Error(
        `Select a valid location ${space.spaceType} is not ${spaceType}`,
      );
    }
    AresHandler.ifAres(this, () => {
      if (!AresHandler.canCover(space, tile)) {
        throw new Error('Selected space is occupied: ' + space.id);
      }
    });

    // Oceans are not subject to Ares adjacency production penalties.
    const subjectToHazardAdjacency = tile.tileType !== TileType.OCEAN;

    AresHandler.ifAres(this, () => {
      AresHandler.assertCanPay(this, player, space, subjectToHazardAdjacency);
    });

    // Part 2. Collect additional fees.
    // Adjacency costs are before the hellas ocean tile because this is a mandatory cost.
    AresHandler.ifAres(this, () => {
      AresHandler.payAdjacencyAndHazardCosts(this, player, space, subjectToHazardAdjacency);
    });

    // Hellas special requirements ocean tile
    if (space.id === SpaceName.HELLAS_OCEAN_TILE &&
        this.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES &&
        this.gameOptions.boardName === BoardName.HELLAS) {
      if (player.color !== Color.NEUTRAL) {
        this.defer(new PlaceOceanTile(player, this, 'Select space for ocean from placement bonus'));
        this.defer(new SelectHowToPayDeferred(player, 6, false, false, 'Select how to pay for placement bonus ocean'));
      }
    }


    // Part 3. Setup for bonuses
    const arcadianCommunityBonus = space.player === player && player.isCorporation(CardName.ARCADIAN_COMMUNITIES);
    let startingResources: Multiset<Resources | ResourceType> | undefined = undefined;
    AresHandler.ifAres(this, () => {
      startingResources = AresHandler.beforeTilePlacement(player);
    });
    const initialTileTypeForAres = space.tile?.tileType;
    const coveringExistingTile = space.tile !== undefined;

    // Part 4. Place the tile
    space.tile = tile;
    space.player = player;
    LogHelper.logTilePlacement(this, player, space, tile.tileType);

    // Part 5. Collect the bonuses

    if (this.phase !== Phase.SOLAR) {
      if (!coveringExistingTile) {
        space.bonus.forEach((spaceBonus) => {
          this.grantSpaceBonus(player, spaceBonus);
        });
      }

      this.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
        if (Board.isOceanSpace(adjacentSpace)) {
          player.megaCredits += player.oceanBonus;
        }
      });

      AresHandler.ifAres(this, (aresData) => {
        AresHandler.earnAdjacencyBonuses(this, aresData, player, space);
      });

      PartyHooks.applyMarsFirstRulingPolicy(this, player, spaceType);

      if (arcadianCommunityBonus) {
        player.megaCredits += 3;
      }
    } else {
      space.player = undefined;
    }

    // Mining Guild tile placement effects should resolve before removing space.player for Oceans
    this.players.forEach((p) => {
      if (p.corporationCard !== undefined &&
          p.corporationCard.onTilePlaced !== undefined) {
        p.corporationCard.onTilePlaced(p, space, this);
      }
      p.playedCards.forEach((playedCard) => {
        if (playedCard.onTilePlaced !== undefined) {
          playedCard.onTilePlaced(p, space, this);
        }
      });
    });

    if (tile.tileType === TileType.OCEAN) {
      space.player = undefined;
    }

    AresHandler.ifAres(this, () => {
      AresHandler.grantBonusForRemovingHazard(this, player, initialTileTypeForAres);

      // Must occur after all other onTilePlaced operations.
      AresHandler.afterTilePlacement(this, player, startingResources);
    });
  }

  public grantSpaceBonus(player: Player, spaceBonus: SpaceBonus) {
    if (spaceBonus === SpaceBonus.DRAW_CARD) {
      player.cardsInHand.push(this.dealer.dealCard());
    } else if (spaceBonus === SpaceBonus.PLANT) {
      player.plants++;
    } else if (spaceBonus === SpaceBonus.STEEL) {
      player.steel++;
    } else if (spaceBonus === SpaceBonus.TITANIUM) {
      player.titanium++;
    } else if (spaceBonus === SpaceBonus.HEAT) {
      player.heat++;
    }
  }

  public addGreenery(
    player: Player, spaceId: string,
    spaceType: SpaceType = SpaceType.LAND,
    shouldRaiseOxygen: boolean = true): undefined {
    this.addTile(player, spaceType, this.getSpace(spaceId), {
      tileType: TileType.GREENERY,
    });
    // Turmoil Greens ruling policy
    PartyHooks.applyGreensRulingPolicy(this, player);

    if (shouldRaiseOxygen) return this.increaseOxygenLevel(player, 1);
    return undefined;
  }
  public addCityTile(
    player: Player, spaceId: string, spaceType: SpaceType = SpaceType.LAND,
    cardName: string | undefined = undefined): void {
    const space = this.getSpace(spaceId);
    this.addTile(player, spaceType, space, {
      tileType: TileType.CITY,
      card: cardName,
    });
  }
  public addOceanTile(
    player: Player, spaceId: string,
    spaceType: SpaceType = SpaceType.OCEAN): void {
    if (this.board.getOceansOnBoard() === constants.MAX_OCEAN_TILES) {
      return;
    }
    this.addTile(player, spaceType, this.getSpace(spaceId), {
      tileType: TileType.OCEAN,
    });
    if (this.phase !== Phase.SOLAR) {
      player.increaseTerraformRating(this);
    }
    AresHandler.ifAres(this, (aresData) => {
      AresHandler.onOceanPlaced(this, aresData, player);
    });
  }

  public removeTile(spaceId: string): void {
    this.getSpace(spaceId).tile = undefined;
    this.getSpace(spaceId).player = undefined;
  }

  public getPlayers(): Array<Player> {
    // We always return them in turn order
    const ret: Array<Player> = [];
    let insertIdx: number = 0;
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

  public getCardPlayer(name: string): Player {
    for (const player of this.players) {
      // Check cards player has played
      for (const card of player.playedCards) {
        if (card.name === name) {
          return player;
        }
      }
      // Check player corporation
      if (player.corporationCard !== undefined && player.corporationCard.name === name) {
        return player;
      }
    }
    throw new Error('No player has played requested card');
  }
  public getCard(name: string): IProjectCard | undefined {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < this.players[i].playedCards.length; j++) {
        if (this.players[i].playedCards[j].name === name) {
          return this.players[i].playedCards[j];
        }
      }
    }
    return undefined;
  }

  public drawProjectCardsByCondition(total: number, include: (card: IProjectCard) => boolean) {
    const result: Array<IProjectCard> = [];
    const discardedCards = new Set<CardName>();

    while (result.length < total) {
      if (discardedCards.size >= this.dealer.getDeckSize() + this.dealer.getDiscardedSize()) {
        this.log('discarded every card without match');
        break;
      }
      const projectCard = this.dealer.dealCard();
      if (include(projectCard)) {
        result.push(projectCard);
      } else {
        discardedCards.add(projectCard.name);
        this.dealer.discard(projectCard);
      }
    }

    LogHelper.logDiscardedCards(this, Array.from(discardedCards));

    return result;
  }

  public drawCardsByTag(tag: Tags, total: number): Array<IProjectCard> {
    return this.drawProjectCardsByCondition(total, (card) => card.tags.includes(tag));
  }

  public drawCardsByResource(resource: ResourceType, total: number): Array<IProjectCard> {
    return this.drawProjectCardsByCondition(total, (card) => card.resourceType !== undefined && card.resourceType === resource);
  }

  public drawCardsByType(cardType: CardType, total: number): Array<IProjectCard> {
    return this.drawProjectCardsByCondition(total, (card) => card.cardType === cardType);
  }

  public getCardsInHandByResource(player: Player, resourceType: ResourceType) {
    return player.cardsInHand.filter((card) => card.resourceType === resourceType);
  }

  public getCardsInHandByType(player: Player, cardType: CardType) {
    return player.cardsInHand.filter((card) => card.cardType === cardType);
  }

  public log(message: string, f?: (builder: LogBuilder) => void) {
    const builder = new LogBuilder(message);
    if (f) {
      f(builder);
    }
    this.gameLog.push(builder.logMessage());
    this.gameAge++;
  }

  public someoneHasResourceProduction(resource: Resources, minQuantity: number = 1): boolean {
    // in soloMode you don't have to decrease resources
    return this.getPlayers().some((p) => p.getProduction(resource) >= minQuantity) || this.isSoloMode();
  }

  private setupSolo() {
    this.players[0].setTerraformRating(14);
    this.players[0].terraformRatingAtGenerationStart = 14;
    // Single player add neutral player
    // put 2 neutrals cities on board with adjacent forest
    const neutral = new Player('neutral', Color.NEUTRAL, true, 0, this.id + '-neutral');

    function placeCityAndForest(game: Game, direction: -1 | 1) {
      const space1 = game.getSpaceByOffset(direction);
      game.addCityTile(neutral, space1.id, SpaceType.LAND);
      const fspace1 = game.board.getForestSpace(
        game.board.getAdjacentSpaces(space1),
      );
      game.addTile(neutral, SpaceType.LAND, fspace1, {
        tileType: TileType.GREENERY,
      });
    }

    placeCityAndForest(this, 1);
    placeCityAndForest(this, -1);

    return undefined;
  }

  public getSpaceByOffset(direction: -1 | 1, type = 'tile') {
    const card = this.dealer.dealCard();
    this.log('Dealt and discarded ${0} (cost ${1}) to place a ${2}', (b) => b.card(card).number(card.cost).string(type));

    const distance = Math.max(card.cost-1, 0); // Some cards cost zero.
    const space = this.board.getNthAvailableLandSpace(distance, direction, undefined /* player */,
      (space) => {
        const adjacentSpaces = this.board.getAdjacentSpaces(space);
        return adjacentSpaces.filter((sp) => sp.tile?.tileType === TileType.CITY).length === 0 && // no cities nearby
            adjacentSpaces.find((sp) => this.board.canPlaceTile(sp)) !== undefined; // can place forest nearby
      });
    if (space === undefined) {
      throw new Error('Couldn\'t find space when card cost is ' + card.cost);
    }
    return space;
  }

  public static deserialize(d: SerializedGame): Game {
    const gameOptions = d.gameOptions;

    const players = d.players.map((element: SerializedPlayer) => Player.deserialize(element));
    const first = players.find((player) => player.id === d.first);
    if (first === undefined) {
      throw new Error(`Player ${d.first} not found when rebuilding First Player`);
    }

    let board;
    if (gameOptions.boardName === BoardName.ELYSIUM) {
      board = ElysiumBoard.deserialize(d.board, players);
    } else if (gameOptions.boardName === BoardName.HELLAS) {
      board = HellasBoard.deserialize(d.board, players);
    } else {
      board = OriginalBoard.deserialize(d.board, players);
    }

    // Rebuild dealer object to be sure that we will have cards in the same order
    const dealer = Dealer.deserialize(d.dealer);

    const game: Game = new Game(d.id, players, first, d.activePlayer, gameOptions, d.seed, board, dealer);

    const milestones: Array<IMilestone> = [];
    d.milestones.forEach((element: IMilestone) => {
      ALL_MILESTONES.forEach((ms: IMilestone) => {
        if (ms.name === element.name) {
          milestones.push(ms);
        }
      });
    });

    game.milestones = milestones;
    game.claimedMilestones = deserializeClaimedMilestones(d.claimedMilestones, players, milestones);

    const awards: Array<IAward> = [];
    d.awards.forEach((element: IAward) => {
      ALL_AWARDS.forEach((award: IAward) => {
        if (award.name === element.name) {
          awards.push(award);
        }
      });
    });

    game.awards = awards;
    game.fundedAwards = deserializeFundedAwards(d.fundedAwards, players, awards);

    if (gameOptions.aresExtension) {
      game.aresData = d.aresData;
    }
    // Reload colonies elements if needed
    if (gameOptions.coloniesExtension) {
      game.colonyDealer = new ColonyDealer();

      if (d.colonyDealer !== undefined) {
        game.colonyDealer.discardedColonies = loadColoniesFromJSON(d.colonyDealer.discardedColonies);
      }

      game.colonies = loadColoniesFromJSON(d.colonies);
    }

    // Reload turmoil elements if needed
    if (d.turmoil && gameOptions.turmoilExtension) {
      game.turmoil = Turmoil.deserialize(d.turmoil);
    }

    game.passedPlayers = new Set<PlayerId>(d.passedPlayers);
    game.donePlayers = new Set<PlayerId>(d.donePlayers);
    game.researchedPlayers = new Set<PlayerId>(d.researchedPlayers);
    game.draftedPlayers = new Set<PlayerId>(d.draftedPlayers);

    const cardFinder = new CardFinder();
    // Reinit undrafted cards map
    game.unDraftedCards = new Map<PlayerId, IProjectCard[]>();
    d.unDraftedCards.forEach((unDraftedCard) => {
      game.unDraftedCards.set(unDraftedCard[0], cardFinder.cardsFromJSON(unDraftedCard[1]));
    });

    game.lastSaveId = d.lastSaveId;
    game.clonedGamedId = d.clonedGamedId;
    game.gameAge = d.gameAge;
    game.gameLog = d.gameLog;
    game.generation = d.generation;
    game.phase = d.phase;
    game.oxygenLevel = d.oxygenLevel;
    game.temperature = d.temperature;
    game.venusScaleLevel = d.venusScaleLevel;
    game.activePlayer = d.activePlayer;
    game.draftRound = d.draftRound;
    game.initialDraftIteration = d.initialDraftIteration;
    game.monsInsuranceOwner = d.monsInsuranceOwner;
    game.someoneHasRemovedOtherPlayersPlants = d.someoneHasRemovedOtherPlayersPlants;

    // Still in Draft or Research of generation 1
    if (game.generation === 1 && players.some((p) => p.corporationCard === undefined)) {
      if (gameOptions.initialDraftVariant) {
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
    } else {
      // We should be in ACTION phase, let's prompt the active player for actions
      game.getPlayerById(game.activePlayer).takeAction(game);
    }

    return game;
  }
}

