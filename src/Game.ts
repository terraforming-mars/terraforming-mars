import { Player, PlayerId } from "./Player";
import {Dealer, ALL_VENUS_CORPORATIONS, ALL_CORPORATION_CARDS, ALL_CORP_ERA_CORPORATION_CARDS, ALL_PRELUDE_CORPORATIONS, ALL_COLONIES_CORPORATIONS, ALL_TURMOIL_CORPORATIONS, ALL_PROMO_CORPORATIONS} from "./Dealer";
import {ISpace} from "./ISpace";
import {SpaceType} from "./SpaceType";
import {TileType} from "./TileType";
import {SpaceBonus} from "./SpaceBonus";
import {ITile} from "./ITile";
import {IProjectCard} from "./cards/IProjectCard";
import {BeginnerCorporation} from "./cards/corporation/BeginnerCorporation";
import {CorporationCard} from "./cards/corporation/CorporationCard";
import {OriginalBoard} from "./OriginalBoard";
import {SelectCard} from "./inputs/SelectCard";
import {SelectSpace} from "./inputs/SelectSpace";
import {AndOptions} from "./inputs/AndOptions";
import {PlayerInput} from "./PlayerInput";
import {Phase} from "./Phase";
import {ClaimedMilestone} from "./ClaimedMilestone";
import {FundedAward} from "./FundedAward";
import {IMilestone} from "./milestones/IMilestone";
import {ResourceType} from "./ResourceType";
import * as constants from "./constants";
import {Color} from "./Color";
import {IAward} from "./awards/IAward";
import {Tags} from "./cards/Tags";
import {Resources} from "./Resources";
import {ORIGINAL_MILESTONES, VENUS_MILESTONES, ELYSIUM_MILESTONES, HELLAS_MILESTONES} from "./milestones/Milestones";
import {ORIGINAL_AWARDS, VENUS_AWARDS, ELYSIUM_AWARDS, HELLAS_AWARDS} from "./awards/Awards";
import {SpaceName} from "./SpaceName";
import {BoardColony, Board} from "./Board";
import { CorporationName } from "./CorporationName";
import {ElysiumBoard} from "./ElysiumBoard";
import {HellasBoard} from "./HellasBoard";
import {BoardName} from "./BoardName";
import {IColony} from "./colonies/Colony";
import {ColonyDealer, getColonyByName} from "./colonies/ColonyDealer";
import {PlayerInterrupt} from "./interrupts/PlayerInterrupt";
import {SelectOcean} from "./interrupts/SelectOcean";
import {SelectResourceCard} from "./interrupts/SelectResourceCard";
import {SelectColony} from "./interrupts/SelectColony";
import {SelectRemoveColony} from "./interrupts/SelectRemoveColony";
import {SelectResourceProductionDecrease} from "./interrupts/SelectResourceProductionDecrease";
import {ICard} from "./cards/ICard";
import {SelectResourceDecrease} from "./interrupts/SelectResourceDecrease";
import {SelectHowToPayInterrupt} from "./interrupts/SelectHowToPayInterrupt";
import { ILoadable } from "./ILoadable";
import {LogMessage} from "./LogMessage";
import {LogMessageType} from "./LogMessageType";
import {LogMessageData} from "./LogMessageData";
import {LogMessageDataType} from "./LogMessageDataType";
import {Database} from "./database/Database";
import { SerializedGame } from "./SerializedGame";
import { SerializedPlayer } from "./SerializedPlayer";
import { CardName } from "./CardName";
import { Turmoil } from "./turmoil/Turmoil";
import { PartyHooks } from "./turmoil/parties/PartyHooks";
import { IParty } from "./turmoil/parties/IParty";
import { OrOptions } from "./inputs/OrOptions";
import { SelectOption } from "./inputs/SelectOption";
import { LogHelper } from "./components/LogHelper";
import { ColonyName } from "./colonies/ColonyName";
import { getRandomMilestonesAndAwards } from "./MASynergy";


export interface Score {
  corporation: String;
  playerScore: number;
}

export interface GameOptions {
  draftVariant: boolean;
  corporateEra: boolean;
  preludeExtension: boolean;
  venusNextExtension: boolean;
  coloniesExtension: boolean;
  turmoilExtension: boolean;
  boardName: BoardName;
  showOtherPlayersVP: boolean;
  customCorporationsList: Array<CardName>;
  customColoniesList: Array<ColonyName>;
  cardsBlackList: Array<CardName>;
  solarPhaseOption: boolean;
  shuffleMapOption: boolean;
  promoCardsOption: boolean;
  undoOption: boolean;
  fastModeOption: boolean;
  removeNegativeGlobalEventsOption: boolean;
  includeVenusMA: boolean;
  startingCorporations: number;
  soloTR: boolean;
  clonedGamedId: string | undefined;
  initialDraftVariant: boolean;
  randomMA: boolean;
}

export class Game implements ILoadable<SerializedGame, Game> {
    public activePlayer: PlayerId;
    public claimedMilestones: Array<ClaimedMilestone> = [];
    public milestones: Array<IMilestone> = [];
    public dealer: Dealer;
    public fundedAwards: Array<FundedAward> = [];
    public awards: Array<IAward> = [];
    public generation: number = 1;
    private draftRound: number = 1;
    private initialDraftIteration: number = 1;
    public phase: Phase = Phase.RESEARCH;
    private donePlayers: Set<Player> = new Set<Player>();
    private oxygenLevel: number = constants.MIN_OXYGEN_LEVEL;
    private venusScaleLevel: number = constants.MIN_VENUS_SCALE;
    private passedPlayers: Set<PlayerId> = new Set<PlayerId>();
    private researchedPlayers: Set<PlayerId> = new Set<PlayerId>();
    private draftedPlayers: Set<PlayerId> = new Set<PlayerId>();
    public board: Board;
    private temperature: number = constants.MIN_TEMPERATURE;
    public gameLog: Array<LogMessage> = [];
    public gameAge: number = 0; // Each log event increases it
    private unDraftedCards: Map<Player, Array<IProjectCard>> = new Map ();
    public interrupts: Array<PlayerInterrupt> = [];
    public monsInsuranceOwner: PlayerId | undefined = undefined;
    public colonies: Array<IColony> = [];
    public colonyDealer: ColonyDealer | undefined = undefined;
    public pendingOceans: number = 0;
    public lastSaveId: number = 0;
    public turmoil: Turmoil | undefined;
    private clonedGamedId: string | undefined;
    public someoneHasRemovedOtherPlayersPlants: boolean = false;
    public seed: number = Math.random();
    public gameOptions: GameOptions;


    constructor(
      public id: string,
      private players: Array<Player>,
      private first: Player,
      gameOptions?: GameOptions
    ) {

      Database.getInstance();

      if (gameOptions === undefined) {
        gameOptions = {
          draftVariant: false,
          initialDraftVariant: false,
          corporateEra: true,
          randomMA: false,
          preludeExtension: false,
          venusNextExtension: false,
          coloniesExtension: false,
          turmoilExtension: false,
          boardName: BoardName.ORIGINAL,
          showOtherPlayersVP: false,
          customCorporationsList: [],
          customColoniesList: [],
          cardsBlackList: [],
          solarPhaseOption: false,
          shuffleMapOption: false,
          promoCardsOption: false,
          undoOption: false,
          fastModeOption: false,
          removeNegativeGlobalEventsOption: false,
          startingCorporations: 2,
          includeVenusMA: true,
          soloTR: false,
          clonedGamedId: undefined
        } as GameOptions
      }
      this.gameOptions = gameOptions;
      this.board = this.boardConstructor(gameOptions.boardName, gameOptions.randomMA, gameOptions.venusNextExtension && gameOptions.includeVenusMA);

      this.activePlayer = first.id;

      this.dealer = new Dealer(
        gameOptions.corporateEra,
        gameOptions.preludeExtension,
        gameOptions.venusNextExtension,
        gameOptions.coloniesExtension,
        gameOptions.promoCardsOption,
        gameOptions.turmoilExtension,
        gameOptions.cardsBlackList
      );

      // Clone game
      if (gameOptions !== undefined
        && gameOptions.clonedGamedId !== undefined
        && !gameOptions.clonedGamedId.startsWith("#")) {
        this.cloneGame(gameOptions.clonedGamedId, this);
        this.clonedGamedId = "#" + gameOptions.clonedGamedId;
        return;
      }


      // Single player game player starts with 14TR
      // and 2 neutral cities and forests on board
      if (players.length === 1) {
        gameOptions.draftVariant = false;
        gameOptions.initialDraftVariant = false;
        gameOptions.randomMA = false;
        gameOptions.draftVariant = false;
        this.setupSolo();
      }

      let corporationCards = ALL_CORPORATION_CARDS.map((cf) => new cf.factory());

      // Add Corporate Era corporation cards
      if (gameOptions.corporateEra) {
        corporationCards.push(...ALL_CORP_ERA_CORPORATION_CARDS.map((cf) => new cf.factory()));
      }

      // Add prelude corporations cards
      if (gameOptions.preludeExtension) {
        corporationCards.push(...ALL_PRELUDE_CORPORATIONS.map((cf) => new cf.factory()));
      }

      // Add Venus Next corporations cards, board colonies and milestone / award
      if (gameOptions.venusNextExtension) {
        corporationCards.push(...ALL_VENUS_CORPORATIONS.map((cf) => new cf.factory()));
        this.setVenusElements(gameOptions.randomMA, gameOptions.includeVenusMA);
      }

      // Add colonies stuff
      if (gameOptions.coloniesExtension) {
        corporationCards.push(...ALL_COLONIES_CORPORATIONS.map((cf) => new cf.factory()));
        this.colonyDealer = new ColonyDealer();
        this.colonies = this.colonyDealer.drawColonies(players.length, this.gameOptions.customColoniesList);
        if (this.players.length === 1) {
          players[0].setProduction(Resources.MEGACREDITS, -2);
          this.addInterrupt(new SelectRemoveColony(players[0], this));
        }
      }

      // Add Turmoil stuff
      if (gameOptions.turmoilExtension) {
        this.turmoil = new Turmoil(this);
        corporationCards.push(...ALL_TURMOIL_CORPORATIONS.map((cf) => new cf.factory()));
      }

      // Add Promo stuff
      if (gameOptions.promoCardsOption) {
        corporationCards.push(...ALL_PROMO_CORPORATIONS.map((cf) => new cf.factory()));
      }

      // Setup custom corporation list
      const minCorpsRequired = players.length * gameOptions.startingCorporations;
      if (gameOptions.customCorporationsList && gameOptions.customCorporationsList.length >= minCorpsRequired) {

        // Init all available corporation cards to choose from
        corporationCards = ALL_CORPORATION_CARDS.map((cf) => new cf.factory());
        corporationCards.push(...ALL_CORP_ERA_CORPORATION_CARDS.map((cf) => new cf.factory()));
        corporationCards.push(...ALL_PRELUDE_CORPORATIONS.map((cf) => new cf.factory()));
        corporationCards.push(...ALL_VENUS_CORPORATIONS.map((cf) => new cf.factory()));
        corporationCards.push(...ALL_COLONIES_CORPORATIONS.map((cf) => new cf.factory()));
        corporationCards.push(...ALL_TURMOIL_CORPORATIONS.map((cf) => new cf.factory()));
        corporationCards.push(...ALL_PROMO_CORPORATIONS.map((cf) => new cf.factory()));

        corporationCards = corporationCards.filter(
          (corpCard) => gameOptions !== undefined && gameOptions.customCorporationsList.includes(corpCard.name)
        );
      }

      corporationCards = this.dealer.shuffleCards(corporationCards);

      // Give each player their corporation cards and other cards
      for (var i = 0; i < players.length; i++) {
        const player = players[i];
        const remainingPlayers = this.players.length - i;

        player.increaseTerraformRatingSteps(player.handicap, this);

        if (!player.beginner ||
          // Bypass beginner choice if any extension is choosen
              gameOptions.preludeExtension ||
              gameOptions.venusNextExtension ||
              gameOptions.coloniesExtension ||
              gameOptions.turmoilExtension ||
              gameOptions.initialDraftVariant) {
          // Failsafe for exceding corporation pool
          if (gameOptions.startingCorporations * remainingPlayers > corporationCards.length) {
            gameOptions.startingCorporations = 2;
          }
          for (let i = 0; i < gameOptions.startingCorporations; i++) {
            const corpCard : CorporationCard | undefined = corporationCards.pop();
            if (corpCard !== undefined) {
              player.dealtCorporationCards.push(corpCard);
            } else {
              throw new Error("No corporation card dealt for player");
            }
          }
          if (!gameOptions.initialDraftVariant) {
            for (let i = 0; i < 10; i++) {
              player.dealtProjectCards.push(this.dealer.dealCard());
            }
          }
          if (gameOptions.preludeExtension) {
            for (let i = 0; i < 4; i++) {
              player.dealtPreludeCards.push(this.dealer.dealPreludeCard());
            }
          }

          this.setStartingProductions(player);

          if (!gameOptions.initialDraftVariant) {
            player.setWaitingFor(this.pickCorporationCard(player), () => {});
          }
        } else {
          this.setStartingProductions(player);
          this.playerHasPickedCorporationCard(player, new BeginnerCorporation() );
        }
      }

      // Save initial game state
      Database.getInstance().saveGameState(this.id, this.lastSaveId,JSON.stringify(this,this.replacer), this.players.length);

      // Print game_id if solo game
      if (players.length === 1) {
        this.log(
          LogMessageType.DEFAULT,
          "The id of this game is ${0}",
          new LogMessageData(LogMessageDataType.STRING, this.id.toString())
        );        
      }      

      this.log(
        LogMessageType.NEW_GENERATION,
        "Generation ${0}",
        new LogMessageData(LogMessageDataType.STRING, this.generation.toString())
      );

      // Initial Draft
      if (gameOptions.initialDraftVariant) {
        this.runDraftRound(true);
        return;
      }
    }

    public isSoloMode() :boolean {
      if (this.players.length === 1) return true;
      return false;
    }

    private setStartingProductions(player: Player) {
      if (!this.gameOptions.corporateEra) {
        player.setProduction(Resources.MEGACREDITS);
        player.setProduction(Resources.STEEL);
        player.setProduction(Resources.TITANIUM);
        player.setProduction(Resources.PLANTS);
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.HEAT);
      }
    }

    // Function to retrieve a player by it's id
    public getPlayerById(id: string): Player {
      return this.players.filter(p => p.id === id)[0];
    }

    // Function to return an array of players from an array of player ids
    public getPlayersById(ids: Array<string>): Array<Player> {
      let players: Array<Player> = [];
      ids.forEach(id => players.push(this.getPlayerById(id)));
      return players;
    }

    // Function to construct the board and milestones/awards list
    public boardConstructor(boardName: BoardName, randomMA: boolean, hasVenus: boolean): Board {
      const requiredQty = 5;

      if (boardName === BoardName.ELYSIUM) {
        if (randomMA) {
          this.setRandomMilestonesAndAwards(hasVenus, requiredQty);
        } else {
          this.milestones.push(...ELYSIUM_MILESTONES);
          this.awards.push(...ELYSIUM_AWARDS);
        }

        return new ElysiumBoard(this.gameOptions.shuffleMapOption, this.seed);
      } else if (boardName === BoardName.HELLAS) {
        if (randomMA) {
          this.setRandomMilestonesAndAwards(hasVenus, requiredQty);
        } else {
          this.milestones.push(...HELLAS_MILESTONES);
          this.awards.push(...HELLAS_AWARDS);
        }

        return new HellasBoard(this.gameOptions.shuffleMapOption, this.seed);
      } else {
        if (randomMA) {
          this.setRandomMilestonesAndAwards(hasVenus, requiredQty);
        } else {
          this.milestones.push(...ORIGINAL_MILESTONES);
          this.awards.push(...ORIGINAL_AWARDS);
        }

        return new OriginalBoard(this.gameOptions.shuffleMapOption, this.seed);
      }
    }

    public setRandomMilestonesAndAwards(hasVenus: boolean, requiredQty: number) {
      const MA_Info = getRandomMilestonesAndAwards(hasVenus, requiredQty);
      this.milestones.push(...MA_Info.milestones);
      this.awards.push(...MA_Info.awards);
    }

    // Add Venus Next board colonies and milestone / award
    public setVenusElements(randomMA: boolean, includeVenusMA: boolean) {
      if (randomMA && includeVenusMA) {
        this.milestones = []
        this.awards = []
        this.setRandomMilestonesAndAwards(true, 6);
      } else {
        if (includeVenusMA) this.milestones.push(...VENUS_MILESTONES);
        if (includeVenusMA) this.awards.push(...VENUS_AWARDS);
      }

      this.addVenusBoardSpaces();
    }

    private addVenusBoardSpaces() {
      this.board.spaces.push(
        new BoardColony(SpaceName.DAWN_CITY),
        new BoardColony(SpaceName.LUNA_METROPOLIS),
        new BoardColony(SpaceName.MAXWELL_BASE),
        new BoardColony(SpaceName.STRATOPOLIS)
      );
    }

    private cloneGame(gameId: string, game: Game): void {

        const player = new Player("test", Color.BLUE, false, 0);
        const player2 = new Player("test2", Color.RED, false, 0);
        let gameToRebuild = new Game(gameId,[player,player2], player);
        Database.getInstance().restoreReferenceGame(gameId, gameToRebuild, function (err) {
          try{
            if (err) {
              throw new Error("Game " + gameId + " not found");
            }
          // Check number of players
            if (game.players.length !== gameToRebuild.players.length) {
              throw new Error("Player number missmatch");
            }
          } catch(e) {
            if(e instanceof Error) {
              console.log("Clone game error: " + e.message);
              // Revert to game creation screen with error message
              return;
            }
          }

          // Update game options
          game.gameOptions = gameToRebuild.gameOptions;
          game.board = gameToRebuild.board;

          // Update dealers
          game.dealer = gameToRebuild.dealer;
          game.colonyDealer = gameToRebuild.colonyDealer;

          // Update other objects
          game.milestones = gameToRebuild.milestones;
          game.awards = gameToRebuild.awards;
          game.colonies = gameToRebuild.colonies;
          game.turmoil = gameToRebuild.turmoil;

          if(gameToRebuild.gameOptions.venusNextExtension) {
            game.addVenusBoardSpaces();
          }

          // Set active player
          let playerIndex = gameToRebuild.players.indexOf(gameToRebuild.first);
          game.first = game.players[playerIndex];
          game.activePlayer = game.players[playerIndex].id;

          // Recreate turmoil lobby and reserve (Turmoil stores some players ids)
          if (gameToRebuild.gameOptions.turmoilExtension && game.turmoil !== undefined) {
            game.turmoil.lobby.clear();
            game.turmoil.delegate_reserve = [];
            game.getPlayers().forEach(player => {
              if (game.turmoil !== undefined) {
                game.turmoil.lobby.add(player.id);
                for (let i = 0; i < 6; i++) {
                  game.turmoil.delegate_reserve.push(player.id);
                }
              }
            });
            for (let i = 0; i < 13; i++) {
              game.turmoil.delegate_reserve.push("NEUTRAL");
            }
          }

          // Update Players
          game.players.forEach(player => {
            let playerIndex = game.players.indexOf(player);
            let referencePlayer = gameToRebuild.players[playerIndex];
            player.dealtCorporationCards = referencePlayer.dealtCorporationCards;
            player.dealtPreludeCards = referencePlayer.dealtPreludeCards;
            player.dealtProjectCards = referencePlayer.dealtProjectCards;
            player.setTerraformRating(referencePlayer.getTerraformRating());

            // Special case solo play and Colonies
            if (game.players.length === 1 && game.gameOptions.coloniesExtension) {
              player.setProduction(Resources.MEGACREDITS, -2);
              game.addInterrupt(new SelectRemoveColony(player, game));
            }
            if (!game.gameOptions.initialDraftVariant) {
              player.setWaitingFor(game.pickCorporationCard(player), () => {});
            }
          });
          // Initial Draft
          if (game.gameOptions.initialDraftVariant) {
            game.runDraftRound(true);
            return;
          }
        });
    }

    public addSelectHowToPayInterrupt(player: Player, amount: number, canUseSteel: boolean, canUseTitanium: boolean, title?: string): void {
      if ((!player.canUseHeatAsMegaCredits || player.heat === 0) &&
          (!canUseSteel || player.steel === 0) &&
          (!canUseTitanium || player.titanium === 0)) {
            player.megaCredits -= amount;
            return;
      }
      this.addInterrupt(new SelectHowToPayInterrupt(player, amount, title, canUseSteel, canUseTitanium));
    }

    public addOceanInterrupt(player: Player, title?: string, isWorldGov: boolean = false): void {
      if (this.board.getOceansOnBoard() + this.pendingOceans  >= constants.MAX_OCEAN_TILES) {
        return;
      }
      this.pendingOceans++;
      this.addInterrupt(new SelectOcean(player, this, title, isWorldGov));
    }

    public addColonyInterrupt(player: Player, allowDuplicate: boolean = false, title: string): void {
      let openColonies = this.colonies.filter(colony => colony.colonies.length < 3
        && (colony.colonies.indexOf(player.id) === -1 || allowDuplicate)
        && colony.isActive);
      if (openColonies.length >0 ) {
        this.addInterrupt(new SelectColony(player, this, openColonies, title));
      }
    }

    public addResourceInterrupt(player: Player, resourceType: ResourceType, count: number = 1, optionalCard : ICard | undefined, restrictedTag?: Tags, title?: string): void {
      let resourceCards = player.getResourceCards(resourceType);
      // Played card is not into playedCards array yet
      if (optionalCard !== undefined) {
        resourceCards.push(optionalCard);
      }
      if (restrictedTag !== undefined) {
        resourceCards = resourceCards.filter(card => card.tags.indexOf(restrictedTag) !== -1);
      }
      if (resourceCards.length === 0) {
        return;
      }
      this.addInterrupt(new SelectResourceCard(player, this, resourceType, resourceCards, title, count));
    }

    public addResourceProductionDecreaseInterrupt(player: Player, resource: Resources, count: number = 1, title?: string): void {
      if (this.isSoloMode()) return;

      let candidates: Array<Player> = [];
      if (resource === Resources.MEGACREDITS) {
        candidates = this.getPlayers().filter((p) => p.getProduction(resource) >= count - 5);
      } else {
        candidates = this.getPlayers().filter((p) => p.getProduction(resource) >= count);
      }

      if (candidates.length === 0) {
        return;
      } else if (candidates.length === 1) {
        candidates[0].setProduction(resource, -count, this, player);
        return undefined;
      } else {
        this.addInterrupt(new SelectResourceProductionDecrease(player, candidates, this, resource, count, title));
      }
    }

    public addResourceDecreaseInterrupt(player: Player, resource: Resources, count: number = 1, title?: string): void {
      if (this.isSoloMode()) {
        // Crash site cleanup hook
        if (resource === Resources.PLANTS) this.someoneHasRemovedOtherPlayersPlants = true;
        return;
      }

      let candidates: Array<Player> = [];
      if (resource === Resources.PLANTS) {
        candidates = this.getPlayers().filter((p) => p.id !== player.id && !p.plantsAreProtected() && p.getResource(resource) > 0);
      } else {
        candidates = this.getPlayers().filter((p) => p.id !== player.id && p.getResource(resource) > 0);
      }

      if (candidates.length === 0) {
        return;
      } else if (candidates.length === 1) {
        let qtyToRemove = Math.min(candidates[0].plants, count);

        if (resource === Resources.PLANTS) {
          this.addInterrupt({ player, playerInput: new OrOptions(
            new SelectOption("Remove " + qtyToRemove + " plants from " + candidates[0].name, "Remove plants", () => {
              candidates[0].setResource(resource, -qtyToRemove, this, player);
              return undefined;
            }),
            new SelectOption("Skip removing plants", "Confirm", () => {
              return undefined;
            })
          )});
        } else {
          candidates[0].setResource(resource, -qtyToRemove, this, player);
          return;
        }
      } else {
        if (resource === Resources.PLANTS) {
          const removalOptions = candidates.map((candidate) => {
            let qtyToRemove = Math.min(candidate.plants, count);

            return new SelectOption("Remove " + qtyToRemove + " plants from " + candidate.name, "Remove plants", () => {
              candidate.setResource(resource, -qtyToRemove, this, player);
              return undefined;
            })
          });

          this.addInterrupt({ player, playerInput: new OrOptions(
            ...removalOptions,
            new SelectOption("Skip removing plants", "Confirm", () => { return undefined; })
          )});
        } else {
          this.addInterrupt(new SelectResourceDecrease(player, candidates, this, resource, count, title));
        }
      }
    }

    public addInterrupt(interrupt: PlayerInterrupt): void {
        this.interrupts.push(interrupt);
    }

    public milestoneClaimed(milestone: IMilestone): boolean {
      return this.claimedMilestones.find(
          (claimedMilestone) => claimedMilestone.milestone === milestone
      ) !== undefined;
    }

    public noOceansAvailable(): boolean {
      return this.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES;
    }

    private marsIsTerraformed(): boolean {
      if (this.players.length === 1 && this.gameOptions.venusNextExtension) {
        return  this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL &&
                this.temperature >= constants.MAX_TEMPERATURE &&
                this.board.getOceansOnBoard() === constants.MAX_OCEAN_TILES &&
                this.getVenusScaleLevel() === constants.MAX_VENUS_SCALE;
      }
      return this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL &&
             this.temperature >= constants.MAX_TEMPERATURE &&
             this.board.getOceansOnBoard() === constants.MAX_OCEAN_TILES;
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
        throw new Error("All awards already funded");
      }
      this.log(
        LogMessageType.DEFAULT,
        "${0} funded ${1} award",
        new LogMessageData(LogMessageDataType.PLAYER, player.id),
        new LogMessageData(LogMessageDataType.AWARD, award.name)
      );
      this.fundedAwards.push({
        award: award,
        player: player
      });
    }

    public hasBeenFunded(award: IAward): boolean {
      return this.fundedAwards.find(
          (fundedAward) => fundedAward.award === award
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

    private playerHasPickedCorporationCard(player: Player, corporationCard: CorporationCard){
      player.pickedCorporationCard = corporationCard;
      // if all players picked corporationCard
      if(this.players.filter(aplayer => aplayer.pickedCorporationCard === undefined).length === 0 ){
        for (let somePlayer of this.getPlayers()) {
          this.playCorporationCard(somePlayer, somePlayer.pickedCorporationCard!);
        }
      }
    }

    private playCorporationCard(
        player: Player, corporationCard: CorporationCard
    ): void {
      // Check for negative M€
      let cardCost = player.cardCost;
      if (corporationCard.name === CardName.TERRALABS_RESEARCH) {
        cardCost = 1;
      } else if (corporationCard.name === CardName.POLYPHEMOS) {
        cardCost = 5;
      }
      if (corporationCard.name !== new BeginnerCorporation().name && player.cardsInHand.length * cardCost > corporationCard.startingMegaCredits) {
        player.cardsInHand = [];
        player.preludeCardsInHand = [];
        throw new Error("Too many cards selected");
      }

      player.corporationCard = corporationCard;
      corporationCard.play(player, this);
      player.megaCredits = corporationCard.startingMegaCredits;
      if (corporationCard.name !== new BeginnerCorporation().name) {
        let cardsToPayFor: number = player.cardsInHand.length;
        player.megaCredits -= cardsToPayFor * player.cardCost;
      }

      // trigger other corp's effect, e.g. SaturnSystems,PharmacyUnion,Splice
      for (let somePlayer of this.getPlayers()) {
        if (somePlayer !== player && somePlayer.corporationCard !== undefined && somePlayer.corporationCard.onCorpCardPlayed !== undefined) {
            const actionFromPlayedCard: OrOptions | void = somePlayer.corporationCard.onCorpCardPlayed(player, this, corporationCard);
            if (actionFromPlayedCard !== undefined) {  // always be undefined for the present
                this.interrupts.push({
                    player: player,
                    playerInput: actionFromPlayedCard
                });
            }
        }
      }

      //Activate some colonies
      if (this.gameOptions.coloniesExtension && corporationCard.resourceType !== undefined) {
        this.colonies.filter(colony => colony.resourceType !== undefined && colony.resourceType === corporationCard.resourceType).forEach(colony => {
          colony.isActive = true;
        });
      }

      this.playerIsFinishedWithResearchPhase(player);
    }

    private pickCorporationCard(player: Player): PlayerInput {
      let corporation: CorporationCard;
      const result: AndOptions = new AndOptions(() => { this.playerHasPickedCorporationCard(player, corporation); return undefined; });

      result.title = " ";
      result.buttonLabel = "Start";

      result.options.push(
        new SelectCard<CorporationCard>(
          "Select corporation", undefined, player.dealtCorporationCards,
          (foundCards: Array<CorporationCard>) => {
            corporation = foundCards[0];
            return undefined;
          }
        )
      );

      if (this.gameOptions.preludeExtension) {

        result.options.push(
          new SelectCard(
            "Select 2 Prelude cards", undefined, player.dealtPreludeCards,
            (preludeCards: Array<IProjectCard>) => {
              player.preludeCardsInHand.push(preludeCards[0], preludeCards[1]);
              return undefined;
            }, 2, 2
          )
        );
      }

      result.options.push(
        new SelectCard(
          "Select initial cards to buy", undefined, player.dealtProjectCards,
          (foundCards: Array<IProjectCard>) => {
            for (const dealt of foundCards) {
              if (foundCards.find((foundCard) => foundCard.name === dealt.name)) {
                player.cardsInHand.push(dealt);
              }
            }

            // discard all unpurchased cards
            player.dealtProjectCards
                .filter((card) => !foundCards.includes(card))
                .forEach((card) => this.dealer.discard(card));

            return undefined;
          }, 10, 0
        )
      );
      return result;
    }

    public hasPassedThisActionPhase(player: Player): boolean {
      return this.passedPlayers.has(player.id);
    }

    private incrementFirstPlayer(): void {
      let firstIndex: number = this.players.map(function(x) {return x.id; }).indexOf(this.first.id);
      if (firstIndex === -1) {
        throw new Error("Didn't even find player");
      }
      if (firstIndex === this.players.length - 1) {
        firstIndex = 0;
      } else {
        firstIndex++;
      }
      this.first = this.players[firstIndex];
    }

    private runDraftRound(initialDraft: boolean = false, preludeDraft: boolean = false): void {
      this.draftedPlayers.clear();
      this.players.forEach((player) => {
        player.needsToDraft = true;
        if (this.draftRound === 1 && !preludeDraft) {
          player.runDraftPhase(initialDraft,this,this.getNextDraft(player).name);
        }
        else if (this.draftRound === 1 && preludeDraft) {
          player.runDraftPhase(initialDraft,this,this.getNextDraft(player).name, player.dealtPreludeCards);
        } else {
          let cards = this.unDraftedCards.get(this.getDraftCardsFrom(player));
          this.unDraftedCards.delete(this.getDraftCardsFrom(player));
          player.runDraftPhase(initialDraft, this, this.getNextDraft(player).name, cards);
        }
      });
    }

    private gotoResearchPhase(): void {
      this.phase = Phase.RESEARCH;
      this.researchedPlayers.clear();
      this.players.forEach((player) => {
        player.runResearchPhase(this, this.gameOptions.draftVariant);
      });
    }

    private gotoDraftingPhase(): void {
      this.phase = Phase.DRAFTING;
      this.draftedPlayers.clear();
      this.draftRound = 1;
      this.runDraftRound();
    }

    private gameIsOver(): boolean {
      // Single player game is done after generation 14 or 12 with prelude
      if (this.isSoloMode()) {
        if (this.generation === 14 || (this.generation === 12 && this.gameOptions.preludeExtension)) {
            return true;
        }
        return false; // Solo mode must go on untill 14 or 12 generation even if Mars is already terraformed
      }
      return this.marsIsTerraformed();
    }

    private gotoProductionPhase(): void {
      this.phase = Phase.PRODUCTION;
      this.passedPlayers.clear();
      this.someoneHasRemovedOtherPlayersPlants = false;
      this.players.forEach((player) => {
        player.runProductionPhase();
      });

      if (this.gameIsOver()) {
        this.gotoFinalGreeneryPlacement();
        // Log id or cloned game id
        if (this.clonedGamedId !== undefined && this.clonedGamedId.startsWith("#")) {
          this.log(LogMessageType.DEFAULT, "This game was a clone from game " + this.clonedGamedId);
        } else {
          this.log(LogMessageType.DEFAULT, "This game id was " + this.id);
        }
        return;
      }
      // solar Phase Option
      if (this.gameOptions.solarPhaseOption && ! this.marsIsTerraformed()) {
        this.gotoWorldGovernmentTerraforming();
        return;
      }
      this.gotoEndGeneration();
    }

    private gotoEndGeneration() {
      if (this.gameOptions.coloniesExtension) {
        this.colonies.forEach(colony => {
          colony.endGeneration();
        });
      }

      if(this.gameOptions.turmoilExtension) {
        this.turmoil?.endGeneration(this);
      }

      // Resolve Turmoil interrupts
      if (this.interrupts.length > 0) {
        this.resolveTurmoilInterrupts();
        return;
      }
      
      this.goToDraftOrResearch();
    }

    private resolveTurmoilInterrupts() {
      if (this.interrupts.length > 0) {
        let interrupt = this.interrupts.shift();
        if (interrupt) {
          if (interrupt.beforeAction !== undefined) {
            interrupt.beforeAction();
          }
          interrupt.player.setWaitingFor(interrupt.playerInput, () => {
            this.resolveTurmoilInterrupts();
          });
          return;
        }
      }

      // All turmoil interrupts have been resolved, continue game flow
      this.goToDraftOrResearch();
    }

    private goToDraftOrResearch() {

      this.generation++;
      this.log(
        LogMessageType.NEW_GENERATION,
        "Generation ${0}",
        new LogMessageData(LogMessageDataType.STRING, this.generation.toString())
      );
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
      //Carry on to next phase
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
        if (this.interrupts.length === 0) {
          this.gotoActionPhase();
        } else {
        // Resolve research interrupt (Helion player)
          let interrupt = this.interrupts.shift();
          if (interrupt !== undefined && interrupt.playerInput !== undefined) {
            if (interrupt.beforeAction !== undefined) {
              interrupt.beforeAction();
            }
            interrupt.player.setWaitingFor(interrupt.playerInput, () => {
              this.playerIsFinishedWithResearchPhase(player);
              return;
            });
          }
        }
      }
    }

    private isLastActiveRoundOfDraft(initialDraft: boolean, preludeDraft: boolean = false): boolean {

      if (initialDraft && !preludeDraft && this.draftRound === 4) return true;

      if ( (!initialDraft || preludeDraft) && this.draftRound === 3) return true;

      return false;
    }

    public playerIsFinishedWithDraftingPhase(initialDraft: boolean, player: Player, cards : Array<IProjectCard>): void {
      this.draftedPlayers.add(player.id);
      this.unDraftedCards.set(player,cards);

      player.needsToDraft = false;
      if (!this.allPlayersHaveFinishedDraft()) {
        return;
      }

      if ( ! this.isLastActiveRoundOfDraft(initialDraft, this.initialDraftIteration === 3 ? true : false)) {
        this.draftRound++;
        this.runDraftRound(initialDraft);
      } else {
        // Push last card for each player
        this.players.forEach((player) => {
          let lastCards  = this.unDraftedCards.get(this.getDraftCardsFrom(player));
          if (lastCards !== undefined) {
            player.draftedCards.push(...lastCards);
          }
          player.needsToDraft = undefined;
        
          if (initialDraft && this.initialDraftIteration === 2) {
            player.dealtProjectCards = player.draftedCards;
            player.draftedCards = [];            
          }

          if (initialDraft && this.initialDraftIteration === 2 && !this.gameOptions.preludeExtension) {
            this.gameOptions.initialDraftVariant = false;
            player.setWaitingFor(this.pickCorporationCard(player), () => {});
          }

          if (initialDraft && this.initialDraftIteration === 3) {
            player.dealtPreludeCards = player.draftedCards;
            player.draftedCards = [];
            this.gameOptions.initialDraftVariant = false;
            player.setWaitingFor(this.pickCorporationCard(player), () => {});
          }          
        });

        if (initialDraft && this.initialDraftIteration === 1) {
          this.initialDraftIteration++;
          this.draftRound = 1;
          this.runDraftRound(true);
          return;
        }

        if (initialDraft && this.initialDraftIteration === 2 && this.gameOptions.preludeExtension) {
          this.initialDraftIteration++;
          this.draftRound = 1;
          this.runDraftRound(true, true);
          return;
        }        
        

        if ( ! initialDraft) {
          this.gotoResearchPhase();
        }
      }
    }

    public getDraftCardsFrom(player: Player): Player {
      let nextPlayer = this.getPreviousPlayer(this.players, player);
      if (this.generation%2 === 1) {
        nextPlayer = this.getNextPlayer(this.players, player);
      }
      // Change initial draft direction on second iteration
      if (this.initialDraftIteration === 2 && this.generation === 1) {
        nextPlayer = this.getPreviousPlayer(this.players, player);
      }
      
      if (nextPlayer !== undefined) {
        return nextPlayer;
      }
      return player;
    }

    public getNextDraft(player: Player): Player {
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
      players: Array<Player>, player: Player
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
        players: Array<Player>, player: Player
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

      // Interrupt hook
      if (this.interrupts.length > 0) {
        let interrupt = this.interrupts.shift();
        if (interrupt !== undefined && interrupt.playerInput !== undefined) {
          if (interrupt.beforeAction !== undefined) {
            interrupt.beforeAction();
          }
          interrupt.player.setWaitingFor(interrupt.playerInput, () => {
            this.playerIsFinishedTakingActions();
          });
          return;
        }
      }

      if (this.allPlayersHavePassed()) {
        this.gotoProductionPhase();
        return;
      }

      const nextPlayer = this.getNextPlayer(this.players, this.getPlayerById(this.activePlayer));

      // Defensive coding to fail fast, if we don't find the next
      // player we are in an unexpected game state
      if (nextPlayer === undefined) {
        throw new Error("Did not find player");
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
      let scores:  Array<Score> = [];
      this.players.forEach(player => {
        let corponame: String = "";
        if (player.corporationCard !== undefined) {
          corponame = player.corporationCard.name;
        }
        scores.push({corporation: corponame, playerScore: player.victoryPointsBreakdown.total });
      });

      Database.getInstance().saveGameResults(this.id, this.players.length, this.generation, this.gameOptions, scores);
      if (this.phase === Phase.END) return;
      this.phase = Phase.END;
    }

    public canPlaceGreenery(player: Player): boolean {
      return !this.donePlayers.has(player) &&
             player.plants >= player.plantsNeededForGreenery &&
             this.board.getAvailableSpacesForGreenery(player).length > 0;
    }

    public playerIsDoneWithGame(player: Player): void {
      this.donePlayers.add(player);
      this.gotoFinalGreeneryPlacement();
    }

    private gotoFinalGreeneryPlacement(): void {
      const players = this.players.filter(
          (player) => this.canPlaceGreenery(player)
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
        throw new Error("Was no player left to place final greenery");
      }
    }

    private startFinalGreeneryPlacement(player: Player) {
      this.activePlayer = player.id;
      player.takeActionForFinalGreenery(this);
    }

    private startActionsForPlayer(player: Player) {
      this.activePlayer = player.id;
      player.actionsTakenThisRound = 0;

      // Save the game state after changing the current player
      // Increment the save id
      this.lastSaveId += 1;
      Database.getInstance().saveGameState(this.id, this.lastSaveId,JSON.stringify(this,this.replacer), this.players.length);

      player.takeAction(this);
    }

    public increaseOxygenLevel(
        player: Player, steps: 1 | 2, isWorldGov: boolean = false): undefined {
      if (this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL) {
        return undefined;
      }
      if (steps === 2 && this.oxygenLevel + steps > constants.MAX_OXYGEN_LEVEL) {
        return this.increaseOxygenLevel(player, 1);
      }
      this.oxygenLevel += steps;
      if (!isWorldGov) {
        player.increaseTerraformRatingSteps(steps, this);
      }
      if (this.oxygenLevel === 8 || (steps === 2 && this.oxygenLevel === 9)) {
        return this.increaseTemperature(player, 1, isWorldGov);
      }
      return undefined;
    }

    public getOxygenLevel(): number {
      return this.oxygenLevel;
    }

    public increaseVenusScaleLevel(
      player: Player, steps: 1 | 2 | 3, isWorldGov: boolean = false): SelectSpace | undefined {
    if (this.venusScaleLevel >= constants.MAX_VENUS_SCALE) {
      return undefined;
    }
    if (steps > 1 && this.venusScaleLevel + 2 * steps > constants.MAX_VENUS_SCALE) {
      steps = (steps === 3) ? 2 : 1; // typing disallows decrement
      return this.increaseVenusScaleLevel(player, steps);
    }
    this.venusScaleLevel += 2 * steps;
    if (!isWorldGov) {
      player.increaseTerraformRatingSteps(steps, this);
    }

    // Check for Aphrodite corporation
    this.players.forEach((player) => {
      if (player.isCorporation(CorporationName.APHRODITE)) {
        player.megaCredits += 2 * steps;
      }
    });

    if ((!isWorldGov) && this.venusScaleLevel === 8
        || ((steps === 2 || steps === 3) && this.venusScaleLevel === 10)
        || (steps === 3 && this.venusScaleLevel === 12)
    ) {
      player.cardsInHand.push(this.dealer.dealCard());
    }

    if ((!isWorldGov) && this.venusScaleLevel === 16
        || ((steps === 2 || steps === 3) && this.venusScaleLevel === 18)
        || (steps === 3 && this.venusScaleLevel === 20)
    ) {
      player.increaseTerraformRating(this);
    }

    return undefined;
  }

  public getVenusScaleLevel(): number {
    return this.venusScaleLevel;
  }

    public increaseTemperature(
        player: Player, steps: -2 | 1 | 2 | 3, isWorldGov: boolean = false): undefined {
      if (steps === -2) {
        if (this.temperature >= constants.MIN_TEMPERATURE + 4) {
          this.temperature -= 4;
          return;
        } else if (this.temperature >= constants.MIN_TEMPERATURE + 2) {
          this.temperature -= 2;
          return;
        } else {
          return;
        }
      }

      if (this.temperature >= constants.MAX_TEMPERATURE) {
        return;
      }
      if (steps > 1 && this.temperature + 2 * steps > constants.MAX_TEMPERATURE) {
        steps = (steps === 3) ? 2 : 1; // typing disallows decrement
        this.increaseTemperature(player, steps);
        return;
      }
      this.temperature += 2 * steps;
      if (!isWorldGov) {
        player.increaseTerraformRatingSteps(steps, this);
      }
      // BONUS FOR HEAT PRODUCTION AT -20 and -24
      if (!isWorldGov) {
        if (steps === 3 && this.temperature === -20) {
          player.setProduction(Resources.HEAT, 2);
        } else if (this.temperature === -24 || this.temperature === -20 ||
              (
                (steps === 2 || steps === 3) &&
                (this.temperature === -22 || this.temperature === -18)
              ) ||
              (steps === 3 && this.temperature === -16)
        ) {
          player.setProduction(Resources.HEAT);;
        }
      }

      // BONUS FOR OCEAN TILE AT 0
      if (
          this.temperature === 0 ||
          ((steps === 2 || steps === 3) && this.temperature === 2) ||
          (steps === 3 && this.temperature === 4)
      ) {
        this.addOceanInterrupt(player, "Select space for ocean from temperature increase", isWorldGov);
      }

      return undefined;
    }

    public getTemperature(): number {
      return this.temperature;
    }

    public getGeneration(): number {
      return this.generation;
    }

    public getPassedPlayers():Set<PlayerId> {
      return this.passedPlayers;
    } 

    public getPlayer(name: string): Player {
      const found = this.players.filter((player) => player.name === name);
      if (found.length === 0) {
        throw new Error("Player not found");
      }
      return found[0];
    }

    public getSpace(id: string): ISpace {
      const matchedSpaces = this.board.spaces.filter((space) => space.id === id);
      if (matchedSpaces.length === 1) {
        return matchedSpaces[0];
      }
      throw new Error("Error with getting space");
    }
    public getCitiesInPlayOnMars(): number {
      return this.board.spaces.filter(
          (space) => space.tile !== undefined &&
                   ((space.tile.tileType === TileType.CITY &&
                   space.spaceType !== SpaceType.COLONY)
                   || space.tile.tileType === TileType.CAPITAL)
      ).length;
    }
    public getCitiesInPlay(): number {
      return this.board.spaces.filter((space) => Board.isCitySpace(space)).length;
    }
    public getSpaceCount(tileType: TileType, player: Player): number {
      return this.board.spaces.filter(
          (space) => space.tile !== undefined &&
                   space.tile.tileType === tileType &&
                   space.player !== undefined &&
                   space.player === player
      ).length;
    }
    public addTile(
        player: Player, spaceType: SpaceType,
        space: ISpace, tile: ITile, isWorldGov: boolean = false): void {
      if (space.tile !== undefined) {
        throw new Error("Selected space is occupied");
      }

      // Turmoil Mars First ruling policy
      PartyHooks.applyMarsFirstRulingPolicy(this, player, spaceType, isWorldGov);

      // Hellas special requirements ocean tile
      if (space.id === SpaceName.HELLAS_OCEAN_TILE
          && this.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES
          && this.gameOptions.boardName === BoardName.HELLAS) {

          if (player.color !== Color.NEUTRAL) {
            this.addOceanInterrupt(player, "Select space for ocean from placement bonus");
            this.addSelectHowToPayInterrupt(player, 6, false, false, "Select how to pay for placement bonus ocean");
          }
      }

      // Land claim a player can claim land for themselves
      if (space.player !== undefined && space.player !== player) {
        throw new Error("This space is land claimed by " + space.player.name);
      }
      // Arcadian Communities
      if (space.player !== undefined && space.player === player && player.isCorporation(CorporationName.ARCADIAN_COMMUNITIES)) {
        player.megaCredits += 3;
      }
      if (space.spaceType !== spaceType) {
        throw new Error(
            `Select a valid location ${space.spaceType} is not ${spaceType}`
        );
      }

      space.player = player;
      space.tile = tile;

      if (!isWorldGov) {
        space.bonus.forEach((spaceBonus) => {
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
        });

        this.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
          if (adjacentSpace.tile &&
              adjacentSpace.tile.tileType === TileType.OCEAN) {
            player.megaCredits += player.oceanBonus;
          }
        });
      }else{
        space.player = undefined;
      }

      this.tilePlaced(space);
      LogHelper.logTilePlacement(this, player, space, tile.tileType);

      if (tile.tileType === TileType.OCEAN) {
        space.player = undefined;
      }
    }

    private tilePlaced(space: ISpace) {
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
    }
    public addGreenery(
        player: Player, spaceId: string,
        spaceType: SpaceType = SpaceType.LAND,
        shouldRaiseOxygen: boolean = true): undefined {
      this.addTile(player, spaceType, this.getSpace(spaceId), {
        tileType: TileType.GREENERY
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
        card: cardName
      });
    }
    public addOceanTile(
        player: Player, spaceId: string,
        spaceType: SpaceType = SpaceType.OCEAN, isWorldGov: boolean = false): void {
      if (this.board.getOceansOnBoard() === constants.MAX_OCEAN_TILES) {
        return;
      }
      this.addTile(player, spaceType, this.getSpace(spaceId), {
        tileType: TileType.OCEAN
      }, isWorldGov);
      if (!isWorldGov) {
        player.increaseTerraformRating(this);
      }
    }

    public removeTile(spaceId: string): void {
      this.getSpace(spaceId).tile = undefined;
      this.getSpace(spaceId).player = undefined;
    }

    public getPlayers(): Array<Player> {
      // We always return them in turn order
      let ret: Array<Player> = [];
      let insertIdx: number = 0;
      for (let p of this.players) {
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
      for (let player of this.players) {
        // Check cards player has played
        for (let card of player.playedCards) {
          if (card.name === name) {
            return player;
          }
        }
        // Check player corporation
        if (player.corporationCard !== undefined && player.corporationCard.name === name) {
          return player;
        }
      }
      throw new Error("No player has played requested card");
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

    public drawCardsByTag(tag: Tags, total: number): Array<IProjectCard> {
      let cardsToDraw = 0;
      const result: Array<IProjectCard> = [];
      const discardedCards: Array<IProjectCard> = [];

      while (cardsToDraw < total) {
        const projectCard = this.dealer.dealCard();
        if (projectCard.tags.includes(tag)) {
          cardsToDraw++;
          result.push(projectCard);
        } else {
          discardedCards.push(projectCard);
          this.dealer.discard(projectCard);
        }
      }

      this.log(
        LogMessageType.DEFAULT,
        discardedCards.length + " card(s) were discarded",
       ...discardedCards.map((card) => new LogMessageData(LogMessageDataType.CARD, card.name)),
      );

      return result;
    }

    public drawCardsByResource(resource: ResourceType, total: number): Array<IProjectCard> {
      let cardsToDraw = 0;
      const result: Array<IProjectCard> = [];
      const discardedCards: Array<IProjectCard> = [];

      while (cardsToDraw < total) {
        const projectCard = this.dealer.dealCard();
        if (projectCard.resourceType !== undefined && projectCard.resourceType === resource ) {
          cardsToDraw++;
          result.push(projectCard);
        } else {
          discardedCards.push(projectCard);
          this.dealer.discard(projectCard);
        }
      }

      this.log(
        LogMessageType.DEFAULT,
        discardedCards.length + " card(s) were discarded",
       ...discardedCards.map((card) => new LogMessageData(LogMessageDataType.CARD, card.name)),
      );

      return result;
    }

    public getCardsInHandByTag(player: Player, tag: Tags) {
      return player.cardsInHand.filter((card) => card.tags.includes(tag));
    }

    public getCardsInHandByResource(player: Player, resourceType: ResourceType) {
      return player.cardsInHand.filter((card) => card.resourceType === resourceType);
    }

    public log(type: LogMessageType, message: string, ...data: LogMessageData[]) {
      this.gameLog.push(new LogMessage(type, message, data));
      this.gameAge++;
      if (this.gameLog.length > 50 ) {
        (this.gameLog.shift());
      }
    }

    public someoneHasResourceProduction(resource: Resources, minQuantity: number = 1): boolean {
      // in soloMode you don'thave to decrease resources
      return this.getPlayers().filter((p) => p.getProduction(resource) >= minQuantity).length > 0 || this.isSoloMode() ;
    }

    public hasCardsWithTag(tag: Tags, requiredQuantity: number = 1) {
      return this.dealer.deck.filter((card) => card.tags.includes(tag)).length >= requiredQuantity;
    }

    public hasCardsWithResource(resource: ResourceType, requiredQuantity: number = 1) {
      return this.dealer.deck.filter((card) => card.resourceType === resource).length >= requiredQuantity;
    }

    private setupSolo() {
      this.players[0].setTerraformRating(14);
      this.players[0].terraformRatingAtGenerationStart = 14;
      // Single player add neutral player
      // put 2 neutrals cities on board with adjacent forest
      const neutral = new Player("neutral", Color.NEUTRAL, true, 0);
      const space1 = this.board.getRandomCitySpace(0);
      this.addCityTile(neutral, space1.id, SpaceType.LAND);
      const fspace1 = this.board.getForestSpace(
          this.board.getAdjacentSpaces(space1)
      );
      this.addTile(neutral, SpaceType.LAND, fspace1, {
        tileType: TileType.GREENERY
      });
      const space2 = this.board.getRandomCitySpace(30);
      this.addCityTile(neutral, space2.id, SpaceType.LAND);
      const fspace2 = this.board.getForestSpace(
          this.board.getAdjacentSpaces(space2)
      );
      this.addTile(neutral, SpaceType.LAND, fspace2, {
        tileType: TileType.GREENERY
      });
      return undefined;
    }

    // Custom replacer to transform Map and Set to Array
    public replacer(key: any, value: any) {
      // Prevent infinite loop because interrupts contains game object.
      if (key === "interrupts"){
        return [];
      }
      else if (value instanceof Set) {
        return Array.from(value);
      }
      else if(value instanceof Map) {
        return Array.from(value.entries());
      }
      return value;
    }

    // Function used to rebuild each objects
    public loadFromJSON(d: SerializedGame): Game {
      // Assign each attributes
      let o = Object.assign(this, d);

      // Rebuild dealer object to be sure that we will have cards in the same order
      let dealer = new Dealer(this.gameOptions.corporateEra, this.gameOptions.preludeExtension, this.gameOptions.venusNextExtension, this.gameOptions.coloniesExtension, this.gameOptions.promoCardsOption, this.gameOptions.turmoilExtension);
      this.dealer = dealer.loadFromJSON(d.dealer);

      // Rebuild every player objects
      this.players = d.players.map((element: SerializedPlayer)  => {
        let player = new Player(element.name, element.color, element.beginner, element.handicap);
        return player.loadFromJSON(element);
      });


      // Rebuild milestones, awards and board elements
      if (this.gameOptions.boardName === BoardName.ELYSIUM) {
        this.board = new ElysiumBoard(this.gameOptions.shuffleMapOption, this.seed);
      } else if (this.gameOptions.boardName === BoardName.HELLAS) {
        this.board = new HellasBoard(this.gameOptions.shuffleMapOption, this.seed);
      } else {
        this.board = new OriginalBoard(this.gameOptions.shuffleMapOption, this.seed);
      }

      this.milestones = [];
      this.awards = [];

      let allMilestones = ELYSIUM_MILESTONES.concat(HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES);

      d.milestones.forEach((element: IMilestone) => {
        allMilestones.forEach((ms: IMilestone) => {
          if (ms.name === element.name) {
            this.milestones.push(ms);
          }
        });
      });

      let allAwards = ELYSIUM_AWARDS.concat(HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS);

      d.awards.forEach((element: IAward) => {
        allAwards.forEach((award: IAward) => {
          if (award.name === element.name) {
            this.awards.push(award);
          }
        });
      });

      // Reload venus elements if needed
      if(this.gameOptions.venusNextExtension) {
        this.addVenusBoardSpaces();
      }

      d.board.spaces.forEach((element: ISpace) => {
        if(element.tile) {
          let space = this.getSpace(element.id);
          let tileType = element.tile.tileType;
          let tileCard = element.tile.card;
          if (element.player){
            const player = this.players.find((player) => player.id === element.player!.id);
            // Prevent loss of "neutral" player tile ownership across reloads
            space.player = player ? player : element.player;
          }
          space.tile = {
            tileType: tileType,
            card: tileCard
          };
        }
        // Correct Land Claim
        else if(element.player) {
          const space = this.getSpace(element.id);
          const player = this.players.find((player) => player.id === element.player!.id);
          space.player = player;
        }
      });

      // Reload colonies elements if needed
      if (this.gameOptions.coloniesExtension) {
        this.colonyDealer = new ColonyDealer();
        this.colonies = new Array<IColony>();

        d.colonyDealer?.discardedColonies.forEach((element: IColony) => {
          if(this.colonyDealer !== undefined) {
            this.colonyDealer.discardedColonies.push(element);
          }
        });

        d.colonies.forEach((element: IColony) => {
          let colony = getColonyByName(element.name);

          // Assign each attributes
          Object.assign(colony, element);

          if (colony !== undefined) {
            this.colonies.push(colony);
          }
        });
      }

      // Reload turmoil elements if needed
      if (this.gameOptions.turmoilExtension) {
        let turmoil = new Turmoil(this);
        this.turmoil = turmoil.loadFromJSON(d.turmoil);

        // Rebuild lobby
        this.turmoil.lobby = new Set<string>(d.turmoil.lobby);

        // Rebuild parties
        d.turmoil.parties.forEach((element: IParty) => {
          let party = this.turmoil?.getPartyByName(element.name);
          if (element.partyLeader) {
            if (element.partyLeader === "NEUTRAL") {
              party!.partyLeader = "NEUTRAL";
            }
            else {
              const partyLeaderId = element.partyLeader;
              const player = this.players.find((player) => player.id === partyLeaderId);
              party!.partyLeader = player!.id;
            }
          }

          // Rebuild parties delegates
          party!.delegates = new Array<PlayerId>();
          element.delegates.forEach((element: PlayerId | "NEUTRAL") => {
            if (element === "NEUTRAL") {
              party!.delegates.push("NEUTRAL");
            }
            else {
              const player = this.players.find((player) => player.id === element);
              if (player) {
                party!.delegates.push(player.id);
              }
            }
          });

        });

      }

      // Rebuild claimed milestones
      this.claimedMilestones = d.claimedMilestones.map((element: ClaimedMilestone)  => {
        const player = this.players.find((player) => player.id === element.player.id);
        const milestone = this.milestones.find((milestone) => milestone.name === element.milestone.name);
        if (player && milestone) {
          return {
            player: player,
            milestone: milestone
          };
        }
        else {
          throw "Player or Milestone not found when rebuilding Claimed Milestone";
        }
      });

      // Rebuild funded awards
      this.fundedAwards = d.fundedAwards.map((element: FundedAward)  => {
        const player = this.players.find((player) => player.id === element.player.id);
        const award = this.awards.find((award) => award.name === element.award.name);
        if (player && award) {
          return {
            player: player,
            award: award
          };
        }
        else {
          throw "Player or Award not found when rebuilding Claimed Award";
        }
      });

      // Rebuild passed players set
      this.passedPlayers = new Set<PlayerId>();
      d.passedPlayers.forEach((element: PlayerId) => {
        const player = this.players.find((player) => player.id === element);
        if (player) {
          this.passedPlayers.add(player.id);
        }
      });

      // Rebuild done players set
      this.donePlayers = new Set<Player>();
      d.donePlayers.forEach((element: PlayerId) => {
        const player = this.players.find((player) => player.id === element);
        if (player) {
          this.donePlayers.add(player);
        }
      });

      // Rebuild researched players set
      this.researchedPlayers = new Set<PlayerId>();
      d.researchedPlayers.forEach((element: PlayerId) => {
        const player = this.players.find((player) => player.id === element);
        if (player) {
          this.researchedPlayers.add(player.id);
        }
      });

      // Rebuild drafted players set
      this.draftedPlayers = new Set<PlayerId>();
      d.draftedPlayers.forEach((element: PlayerId) => {
        const player = this.players.find((player) => player.id === element);
        if (player) {
          this.draftedPlayers.add(player.id);
        }
      });

      // Reinit undrafted cards map
      this.unDraftedCards = new Map<Player, IProjectCard[]>();

      // Define who is the active player and init the take action phase
      const active = this.players.find((player) => player.id === d.activePlayer);
      if (active) {
        // We have to switch active player because it's still the one that ended last turn
        this.activePlayer = active.id;
        this.getPlayerById(this.activePlayer).takeAction(this);
      }
      else {
        throw "No Player found when rebuilding Active Player";
      }

      // Define who was the first player for this generation
      const first = this.players.find((player) => player.id === d.first.id);
      if (first) {
        this.first = first;
      }
      else {
        throw "No Player found when rebuilding First Player";
      }

      return o;
    }
}

