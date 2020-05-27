import {Player} from "./Player";
import {Dealer, ALL_VENUS_CORPORATIONS, ALL_CORPORATION_CARDS, ALL_PRELUDE_CORPORATIONS, ALL_COLONIES_CORPORATIONS, ALL_TURMOIL_CORPORATIONS, ALL_PROMO_CORPORATIONS} from "./Dealer";
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
import {CorporationName} from "./CorporationName";
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
import { PartyName } from "./turmoil/parties/PartyName";
import { IParty } from "./turmoil/parties/IParty";

export interface GameOptions {
  draftVariant: boolean;
  preludeExtension: boolean;
  venusNextExtension: boolean;
  coloniesExtension: boolean;
  turmoilExtension: boolean;
  boardName: BoardName;
  showOtherPlayersVP: boolean;
  customCorporationsList: Array<CardName>;
  solarPhaseOption: boolean;
  promoCardsOption: boolean;
  startingCorporations: number;
  soloTR: boolean;
  clonedGamedId: string | undefined;
}  

export class Game implements ILoadable<SerializedGame, Game> {
    public activePlayer: Player;
    public claimedMilestones: Array<ClaimedMilestone> = [];
    public milestones: Array<IMilestone> = [];
    public dealer: Dealer;
    public fundedAwards: Array<FundedAward> = [];
    public awards: Array<IAward> = [];
    public generation: number = 1;
    private draftRound: number = 1;
    public phase: Phase = Phase.RESEARCH;
    private donePlayers: Set<Player> = new Set<Player>();
    private oxygenLevel: number = constants.MIN_OXYGEN_LEVEL;
    private venusScaleLevel: number = constants.MIN_VENUS_SCALE;
    private passedPlayers: Set<Player> = new Set<Player>();
    private researchedPlayers: Set<Player> = new Set<Player>();
    private draftedPlayers: Set<Player> = new Set<Player>();
    public board: Board;
    private temperature: number = constants.MIN_TEMPERATURE;
    public gameLog: Array<LogMessage> = [];
    public gameAge: number = 0; // Each log event increases it
    private unDraftedCards: Map<Player, Array<IProjectCard>> = new Map ();
    public interrupts: Array<PlayerInterrupt> = [];
    public monsInsuranceOwner: Player | undefined = undefined;
    public colonies: Array<IColony> = [];
    public colonyDealer: ColonyDealer | undefined = undefined;
    public pendingOceans: number = 0;
    public lastSaveId: number = 0;
    private draftVariant: boolean;
    public soloMode: boolean = false;
    private preludeExtension: boolean;
    public venusNextExtension: boolean;
    public coloniesExtension: boolean;
    public turmoilExtension: boolean;
    public boardName: BoardName;
    public showOtherPlayersVP: boolean;
    private solarPhaseOption: boolean;
    public turmoil: Turmoil | undefined;
    private promoCardsOption: boolean;
    private startingCorporations: number;
    public soloTR: boolean;
    private clonedGamedId: string | undefined;

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
          preludeExtension: false,
          venusNextExtension: false,
          coloniesExtension: false,
          turmoilExtension: false,
          boardName: BoardName.ORIGINAL,
          showOtherPlayersVP: false,
          customCorporationsList: [],
          solarPhaseOption: false,
          promoCardsOption: false,
          startingCorporations: 2,
          soloTR: false,
          clonedGamedId: undefined
        } as GameOptions
      }

      this.board = this.boardConstructor(gameOptions.boardName);

      this.activePlayer = first;
      this.boardName = gameOptions.boardName;
      this.draftVariant = gameOptions.draftVariant;
      this.preludeExtension = gameOptions.preludeExtension;
      this.venusNextExtension = gameOptions.venusNextExtension;
      this.coloniesExtension = gameOptions.coloniesExtension;
      this.turmoilExtension = gameOptions.turmoilExtension;      
      this.promoCardsOption = gameOptions.promoCardsOption;
      this.startingCorporations = gameOptions.startingCorporations;
      this.dealer = new Dealer(this.preludeExtension, this.venusNextExtension, this.coloniesExtension, this.promoCardsOption, this.turmoilExtension, Math.random());
      this.showOtherPlayersVP = gameOptions.showOtherPlayersVP;
      this.solarPhaseOption = gameOptions.solarPhaseOption;
      this.soloTR = gameOptions.soloTR;

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
        this.soloMode = true;
        this.draftVariant = false;
        this.setupSolo();
      }

      let corporationCards = ALL_CORPORATION_CARDS.map((cf) => new cf.factory());
      // Add prelude corporations cards
      if (this.preludeExtension) {
        corporationCards.push(...ALL_PRELUDE_CORPORATIONS.map((cf) => new cf.factory()));
      }

      // Add Venus Next corporations cards, board colonies and milestone / award
      if (this.venusNextExtension) {
        corporationCards.push(...ALL_VENUS_CORPORATIONS.map((cf) => new cf.factory()));
        this.setVenusElements();
      }

      // Add colonies stuff
      if (this.coloniesExtension) {
        corporationCards.push(...ALL_COLONIES_CORPORATIONS.map((cf) => new cf.factory()));
        this.colonyDealer = new ColonyDealer();
        this.colonies = this.colonyDealer.drawColonies(players.length);
        if (this.players.length === 1) {
          players[0].setProduction(Resources.MEGACREDITS, -2);
          this.addInterrupt(new SelectRemoveColony(players[0], this));
        }
      }

      // Add Turmoil stuff
      if (this.turmoilExtension) {
        this.turmoil = new Turmoil(this);
        corporationCards.push(...ALL_TURMOIL_CORPORATIONS.map((cf) => new cf.factory()));
      }  

      // Setup custom corporation list
      if (gameOptions.customCorporationsList && gameOptions.customCorporationsList.length >= players.length * 2) {

        // Init all available corporation cards to choose from
        corporationCards = ALL_CORPORATION_CARDS.map((cf) => new cf.factory());
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
      for (const player of players) {
        if (!player.beginner) {
          // Failsafe for exceding corporation pool - Minimum is 12
          if (this.startingCorporations * this.players.length > 12) {
            this.startingCorporations = 2;
          }
          for (let i = 0; i < this.startingCorporations; i++) {
            const corpCard : CorporationCard | undefined = corporationCards.pop();
            if (corpCard !== undefined) {
              player.dealtCorporationCards.push(corpCard);
            } else {
              throw new Error("No corporation card dealt for player");
            }
          }

          for (let i = 0; i < 10; i++) {
            player.dealtProjectCards.push(this.dealer.dealCard());
          }
          if (this.preludeExtension) {
            for (let i = 0; i < 4; i++) {
              player.dealtPreludeCards.push(this.dealer.dealPreludeCard());
            }
          }                 
          player.setWaitingFor(this.pickCorporationCard(player), () => {});
        } else {
          this.playCorporationCard(player, new BeginnerCorporation());
        }    

      }

      // Save initial game state
      Database.getInstance().saveGameState(this.id, this.lastSaveId,JSON.stringify(this,this.replacer));

      this.log(
        LogMessageType.NEW_GENERATION,
        "Generation ${0}",
        new LogMessageData(LogMessageDataType.STRING, this.generation.toString())
      );
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
    public boardConstructor(boardName: BoardName): Board {
      if (boardName === BoardName.ELYSIUM) {
        this.milestones.push(...ELYSIUM_MILESTONES);
        this.awards.push(...ELYSIUM_AWARDS);
        return new ElysiumBoard();
      } else if (boardName === BoardName.HELLAS) {
        this.milestones.push(...HELLAS_MILESTONES);
        this.awards.push(...HELLAS_AWARDS);
        return new HellasBoard();
      } else {        
        this.milestones.push(...ORIGINAL_MILESTONES);
        this.awards.push(...ORIGINAL_AWARDS);

        return new OriginalBoard();
      }
    }

    // Add Venus Next board colonies and milestone / award
    public setVenusElements() {
      this.milestones.push(...VENUS_MILESTONES);
      this.awards.push(...VENUS_AWARDS);
      this.board.spaces.push(
          new BoardColony(SpaceName.DAWN_CITY),
          new BoardColony(SpaceName.LUNA_METROPOLIS),
          new BoardColony(SpaceName.MAXWELL_BASE),
          new BoardColony(SpaceName.STRATOPOLIS)
      );
    }

    private cloneGame(gameId: string, game: Game): void {
      
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
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
          game.draftVariant = gameToRebuild.draftVariant;
          game.soloMode = gameToRebuild.soloMode;
          game.preludeExtension = gameToRebuild.preludeExtension;
          game.venusNextExtension = gameToRebuild.venusNextExtension;
          game.coloniesExtension = gameToRebuild.coloniesExtension;
          game.turmoilExtension = gameToRebuild.turmoilExtension;
          game.boardName = gameToRebuild.boardName;
          game.showOtherPlayersVP = gameToRebuild.showOtherPlayersVP;
          game.solarPhaseOption = gameToRebuild.solarPhaseOption;
          game.promoCardsOption = gameToRebuild.promoCardsOption;
          game.startingCorporations = gameToRebuild.startingCorporations;
          game.soloTR = gameToRebuild.soloTR;

          // Update dealers
          game.dealer = gameToRebuild.dealer;
          game.colonyDealer = gameToRebuild.colonyDealer;

          // Update other objects
          game.milestones = gameToRebuild.milestones;
          game.awards = gameToRebuild.awards;
          game.colonies = gameToRebuild.colonies;
          game.turmoil = gameToRebuild.turmoil;

          if(gameToRebuild.venusNextExtension) {
            game.setVenusElements();
          }

          // Set active player
          //let playerIndex = gameToRebuild.players.indexOf(gameToRebuild.activePlayer);
          let playerIndex = gameToRebuild.players.indexOf(gameToRebuild.first);
          game.first = game.players[playerIndex];
          game.activePlayer = game.players[playerIndex];

          // Recreate turmoil lobby and reserve (Turmoil stores some players ids)
          if (gameToRebuild.turmoilExtension && game.turmoil !== undefined) {
            game.turmoil.lobby.clear();
            game.turmoil.delegate_reserve = [];
            game.getPlayers().forEach(player => {
              if (game.turmoil !== undefined) {
                game.turmoil.lobby.add(player.id);
                for (let i = 0; i < 6; i++) {
                  game.turmoil.delegate_reserve.push(player);   
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

            player.setWaitingFor(game.pickCorporationCard(player), () => {});
          });
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
        && (colony.colonies.indexOf(player) === -1 || allowDuplicate)
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
      if (this.soloMode) {
        return;
      }
      this.addInterrupt(new SelectResourceProductionDecrease(player, this, resource, count, title));
    }

    public addResourceDecreaseInterrupt(player: Player, resource: Resources, count: number = 1, title?: string): void {
      if (this.soloMode) {
        return;
      }
      let candidates: Array<Player> = [];
      if (resource === Resources.PLANTS) {
        candidates = this.getPlayers().filter((p) => p.id !== player.id && !p.hasProtectedHabitats() && p.getResource(resource) > 0);
      } else {
        candidates = this.getPlayers().filter((p) => p.id !== player.id && p.getResource(resource) > 0);
      }

      if (candidates.length === 0) {
        return;
      } else if (candidates.length === 1) {
        candidates[0].setResource(resource, -count, this, player);
        return;
      }

      this.addInterrupt(new SelectResourceDecrease(player, candidates, this, resource, count, title));
    }

    public addInterrupt(interrupt: PlayerInterrupt): void {
        this.interrupts.push(interrupt);
    }

    public getPreludeExtension(): boolean {
      return this.preludeExtension;
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
      if (this.players.length === 1 && this.venusNextExtension) {
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
      if (this.soloTR) {
        if (this.players[0].getTerraformRating() >= 63) {
          return true;
        } else return false;
      }
      if ( ! this.marsIsTerraformed()) return false;
      return this.preludeExtension ? this.generation <= 12 : this.generation <= 14;
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

      //Activate some colonies
      if (this.coloniesExtension && corporationCard.resourceType !== undefined) {
        this.colonies.filter(colony => colony.resourceType !== undefined && colony.resourceType === corporationCard.resourceType).forEach(colony => {
          colony.isActive = true;
        });
      }

      this.playerIsFinishedWithResearchPhase(player);
    }

    private pickCorporationCard(player: Player): PlayerInput {
      let corporation: CorporationCard;
      const result: AndOptions = new AndOptions(() => { this.playCorporationCard(player, corporation); return undefined; });

      result.title = " ";
      result.options.push(
        new SelectCard<CorporationCard>(
          "Select corporation", player.dealtCorporationCards,
          (foundCards: Array<CorporationCard>) => {
            corporation = foundCards[0];
            return undefined;
          }
        )
      );

      if (this.preludeExtension) {

        result.options.push(
          new SelectCard(
            "Select 2 Prelude cards", player.dealtPreludeCards,
            (preludeCards: Array<IProjectCard>) => {
              player.preludeCardsInHand.push(preludeCards[0], preludeCards[1]);
              return undefined;
            }, 2, 2
          )
        );
      }

      result.options.push(
        new SelectCard(
          "Select initial cards to buy", player.dealtProjectCards,
          (foundCards: Array<IProjectCard>) => {
            for (const dealt of foundCards) {
              if (foundCards.find((foundCard) => foundCard.name === dealt.name)) {
                player.cardsInHand.push(dealt);
              } else {
                this.dealer.discard(dealt);
              }
            }
            return undefined;
          }, 10, 0
        )
      );
      return result;
    }

    public hasPassedThisActionPhase(player: Player): boolean {
      return this.passedPlayers.has(player);
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

    private runDraftRound(): void {
      this.draftedPlayers.clear();
      this.players.forEach((player) => {
        if (this.draftRound === 1) {
          player.runDraftPhase(this,this.getNextDraft(player).name);
        } else {
          let cards = this.unDraftedCards.get(this.getDraftCardsFrom(player));
          this.unDraftedCards.delete(this.getDraftCardsFrom(player));
          player.runDraftPhase(this, this.getNextDraft(player).name, cards);
        }
      });
    }

    private gotoResearchPhase(): void {
      this.researchedPlayers.clear();
      this.players.forEach((player) => {
        player.runResearchPhase(this, this.draftVariant);
      });
    }  

    private gotoDraftingPhase(): void {
      this.draftedPlayers.clear();
      this.draftRound = 1;
      this.runDraftRound();
    }

    private gameIsOver(): boolean {
      // Single player game is done after generation 14 or 12 with prelude
      if (this.players.length === 1) {
        if (this.generation === 14 || (this.generation === 12 && this.preludeExtension)) {
            return true;
        }
      }
      return this.marsIsTerraformed();
    }

    private gotoProductionPhase(): void {
      this.passedPlayers.clear();
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
      if (this.solarPhaseOption) {
        this.gotoWorldGovernmentTerraforming();
        return;
      }
      this.gotoDraftOrResearch();
    }

    private gotoDraftOrResearch() {
      if (this.coloniesExtension) {
        this.colonies.forEach(colony => {
          colony.endGeneration();
        });
      }

      if(this.turmoilExtension) {
        this.turmoil?.endGeneration(this);
      }
      
      this.generation++;
      this.log(
        LogMessageType.NEW_GENERATION,
        "Generation ${0}",
        new LogMessageData(LogMessageDataType.STRING, this.generation.toString())
      );
      this.incrementFirstPlayer();

      this.players.forEach((player) => {
        player.terraformRatingAtGenerationStart = player.getTerraformRating();
      });

      if (this.draftVariant) {
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
      this.gotoDraftOrResearch();
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
      this.passedPlayers.add(player);
    }

    private hasResearched(player: Player): boolean {
      return this.researchedPlayers.has(player);
    }

    private hasDrafted(player: Player): boolean {
      return this.draftedPlayers.has(player);
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
      this.researchedPlayers.add(player);
      if (this.allPlayersHaveFinishedResearch()) {
        this.gotoActionPhase();
      }
    }

    public playerIsFinishedWithDraftingPhase(player: Player, cards : Array<IProjectCard>): void {
      this.draftedPlayers.add(player);
      this.unDraftedCards.set(player,cards);
     
      if (!this.allPlayersHaveFinishedDraft()) {
        return;
      }

      if (this.allPlayersHaveFinishedDraft() && this.draftRound < 3) {
        this.draftRound++;
        this.runDraftRound();
      }      

      if (this.allPlayersHaveFinishedDraft() && this.draftRound === 3) {
        // Push last card for each player
        if (cards.length === 1) {
          this.players.forEach((player) => {
            let lastCards  = this.unDraftedCards.get(this.getDraftCardsFrom(player));
            if (lastCards !== undefined && lastCards[0] !== undefined) {
              player.draftedCards.push(lastCards[0]);
            }
          });
        }
        this.gotoResearchPhase();
      }
    }

    public getDraftCardsFrom(player: Player): Player {
      let nextPlayer = this.getPreviousPlayer(this.players, player);
      if (this.generation%2 === 1) {
        nextPlayer = this.getNextPlayer(this.players, player);
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

      const nextPlayer = this.getNextPlayer(this.players, this.activePlayer);

      // Defensive coding to fail fast, if we don't find the next
      // player we are in an unexpected game state
      if (nextPlayer === undefined) {
        throw new Error("Did not find player");
      }

      if (!this.hasPassedThisActionPhase(nextPlayer)) {
        this.startActionsForPlayer(nextPlayer);
      } else {
        // Recursively find the next player
        this.activePlayer = nextPlayer;
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
      this.activePlayer = player;
      player.takeActionForFinalGreenery(this);
    }

    private startActionsForPlayer(player: Player) {
      this.activePlayer = player;
      player.actionsTakenThisRound = 0;

      // Save the game state after changing the current player
      // Increment the save id
      this.lastSaveId += 1;
      Database.getInstance().saveGameState(this.id, this.lastSaveId,JSON.stringify(this,this.replacer));

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
                   space.tile.tileType === TileType.CITY &&
                   space.spaceType !== SpaceType.COLONY
      ).length;
    }
    public getCitiesInPlay(): number {
      return this.board.spaces.filter(
          (space) => space.tile !== undefined &&
                   space.tile.tileType === TileType.CITY
      ).length;
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
      if (this.turmoilExtension 
        && this.turmoil !== undefined 
        && this.turmoil.rulingParty !== undefined 
        && this.turmoil.rulingParty.name === PartyName.MARS
        && spaceType !== SpaceType.COLONY) {
          player.setResource(Resources.STEEL, 1);
      }      

      // Hellas special requirements ocean tile
      if (space.id === SpaceName.HELLAS_OCEAN_TILE 
          && this.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES
          && this.boardName === BoardName.HELLAS) {
          player.megaCredits -= 6;
          this.addOceanInterrupt(player, "Select space for ocean from placement bonus");
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
      }
      
      this.tilePlaced(space);

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
        spaceType: SpaceType = SpaceType.LAND): undefined {
      this.addTile(player, spaceType, this.getSpace(spaceId), {
        tileType: TileType.GREENERY
      });
      // Turmoil Greens ruling policy
      if (this.turmoilExtension 
        && this.turmoil !== undefined 
        && this.turmoil.rulingParty !== undefined 
        && this.turmoil.rulingParty.name === PartyName.GREENS) {
          player.setResource(Resources.MEGACREDITS, 4);
      }
      return this.increaseOxygenLevel(player, 1);
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
      while (cardsToDraw < total) {
        const projectCard = this.dealer.dealCard();
        if (projectCard.tags.includes(tag)) {
          cardsToDraw++;
          result.push(projectCard);
        } else {
          this.dealer.discard(projectCard);
        }
      }
      return result;
    }

    public drawCardsByResource(resource: ResourceType, total: number): Array<IProjectCard> {
      let cardsToDraw = 0;
      const result: Array<IProjectCard> = [];
      while (cardsToDraw < total) {
        const projectCard = this.dealer.dealCard();
        if (projectCard.resourceType !== undefined && projectCard.resourceType === resource ) {
          cardsToDraw++;
          result.push(projectCard);
        } else {
          this.dealer.discard(projectCard);
        }
      }
      return result;
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
      return this.getPlayers().filter((p) => p.getProduction(resource) >= minQuantity).length > 0 || this.soloMode ;
    }

    private setupSolo() {
      this.players[0].setTerraformRating(14);
      this.players[0].terraformRatingAtGenerationStart = 14;
      // Single player add neutral player
      // put 2 neutrals cities on board with adjacent forest
      const neutral = new Player("neutral", Color.NEUTRAL, true);
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
      let dealer = new Dealer(this.preludeExtension, this.venusNextExtension, this.coloniesExtension, this.promoCardsOption, this.turmoilExtension);
      this.dealer = dealer.loadFromJSON(d.dealer);

      // Rebuild every player objects
      this.players = d.players.map((element: SerializedPlayer)  => {
        let player = new Player(element.name, element.color, element.beginner);
        return player.loadFromJSON(element);
      });


      // Rebuild milestones, awards and board elements
      this.milestones = [];
      this.awards = [];
      this.board = this.boardConstructor(d.boardName);

      // Reload venus elements if needed
      if(this.venusNextExtension) {
        this.setVenusElements();
      }

      d.board.spaces.forEach((element: ISpace) => {
        if(element.tile) {
          let space = this.getSpace(element.id);
          let tileType = element.tile.tileType;
          let tileCard = element.tile.card;
          if (element.player){
            const player = this.players.find((player) => player.id === element.player!.id);
            space.player = player;
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

      // Reload colony elements if needed 
      if (this.coloniesExtension) {
        this.colonyDealer = new ColonyDealer();
        this.colonies = new Array<IColony>();
        d.colonies.forEach((element: IColony) => {
          let colonie = getColonyByName(element.name);

          // Assign each attributes
          Object.assign(colonie, element);

          if (colonie !== undefined) {
            if (element.visitor){
              const player = this.players.find((player) => player.id === element.visitor!.id);
              colonie.visitor = player;
            }
            colonie.colonies = new Array<Player>();
            element.colonies.forEach((element: Player) => {
              const player = this.players.find((player) => player.id === element.id);
              if (player) {
                colonie!.colonies.push(player);
              }
            });
            this.colonies.push(colonie);
          }
        });     
      }

      // Reload turmoil elements if needed 
      if (this.turmoilExtension) {
        let turmoil = new Turmoil(this);
        this.turmoil = turmoil.loadFromJSON(d.turmoil);

        // Rebuild chairman
        if (d.turmoil.chairman) {
          if (d.turmoil.chairman === "NEUTRAL"){
            this.turmoil.chairman = "NEUTRAL";
          }
          else {
            const chairman_id = d.turmoil.chairman.id
            const player = this.players.find((player) => player.id === chairman_id);
            this.turmoil.chairman = player;
          }
        }

        // Rebuild lobby
        this.turmoil.lobby = new Set<string>(d.turmoil.lobby);

        // Rebuild delegate reserve
        this.turmoil.delegate_reserve = d.turmoil.delegate_reserve.map((element: SerializedPlayer | "NEUTRAL")  => {
          if(element === "NEUTRAL"){
            return "NEUTRAL";
          }
          else {
            const player = this.players.find((player) => player.id === element.id);
            if (player){
              return player;
            }
            else {
              throw "Player not found when rebuilding delegate reserve";
            }
          }
        });

        // Rebuild party leader
        d.turmoil.parties.forEach((element: IParty) => {
          let party = this.turmoil?.getPartyByName(element.name);
          if (element.partyLeader) {
            if (element.partyLeader === "NEUTRAL") {
              party!.partyLeader = "NEUTRAL";
            }
            else {
              const partyLeaderId = element.partyLeader.id;
              const player = this.players.find((player) => player.id === partyLeaderId);
              party!.partyLeader = player;
            }
          }

          // Rebuild delegates
          party!.delegates = new Array<Player>();
          element.delegates.forEach((element: Player | "NEUTRAL") => {
            if (element === "NEUTRAL") {
              party!.delegates.push("NEUTRAL");
            }
            else {
              const player = this.players.find((player) => player.id === element.id);
              if (player) {
                party!.delegates.push(player);
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
      this.passedPlayers = new Set<Player>();
      d.passedPlayers.forEach((element: SerializedPlayer) => {
        const player = this.players.find((player) => player.id === element.id);
        if (player) {
          this.passedPlayers.add(player);
        }
      });

      // Rebuild done players set
      this.donePlayers = new Set<Player>();
      d.donePlayers.forEach((element: SerializedPlayer) => {
        const player = this.players.find((player) => player.id === element.id);
        if (player) {
          this.donePlayers.add(player);
        }
      });

      // Rebuild researched players set
      this.researchedPlayers = new Set<Player>();
      d.researchedPlayers.forEach((element: SerializedPlayer) => {
        const player = this.players.find((player) => player.id === element.id);
        if (player) {
          this.researchedPlayers.add(player);
        }
      });

      // Rebuild drafted players set
      this.draftedPlayers = new Set<Player>();
      d.draftedPlayers.forEach((element: SerializedPlayer) => {
        const player = this.players.find((player) => player.id === element.id);
        if (player) {
          this.draftedPlayers.add(player);
        }
      });

      // Reinit undrafted cards map
      this.unDraftedCards = new Map<Player, IProjectCard[]>();

      // Mons insurance
      if (d.monsInsuranceOwner) {
        this.monsInsuranceOwner = this.players.find((player) => player.id === d.monsInsuranceOwner!.id);
      }

      // Define who is the active player and init the take action phase
      const active = this.players.find((player) => player.id === d.activePlayer.id);
      if (active) {
        // We have to switch active player because it's still the one that ended last turn
        this.activePlayer = active;
        this.activePlayer.takeAction(this);
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

