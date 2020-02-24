import {Player} from './Player';
import { Dealer, ALL_VENUS_CORPORATIONS, ALL_CORPORATION_CARDS, ALL_PRELUDE_CORPORATIONS, ALL_COLONIES_CORPORATIONS } from './Dealer';
import {ISpace} from './ISpace';
import {SpaceType} from './SpaceType';
import {TileType} from './TileType';
import {SpaceBonus} from './SpaceBonus';
import {ITile} from './ITile';
import {IProjectCard} from './cards/IProjectCard';
import {BeginnerCorporation} from './cards/corporation/BeginnerCorporation';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {OriginalBoard} from './OriginalBoard';
import {SelectCard} from './inputs/SelectCard';
import {SelectSpace} from './inputs/SelectSpace';
import {AndOptions} from './inputs/AndOptions';
import {PlayerInput} from './PlayerInput';
import {Phase} from './Phase';
import {ClaimedMilestone} from './ClaimedMilestone';
import {FundedAward} from './FundedAward';
import {IMilestone} from './milestones/IMilestone';
import {ResourceType} from './ResourceType';
import * as constants from './constants';
import {Color} from './Color';
import {IAward} from './awards/IAward';
import { Tags } from './cards/Tags';
import {Resources} from "./Resources";
import { ORIGINAL_MILESTONES, VENUS_MILESTONES, ELYSIUM_MILESTONES, HELLAS_MILESTONES } from './milestones/Milestones';
import { ORIGINAL_AWARDS, VENUS_AWARDS, ELYSIUM_AWARDS, HELLAS_AWARDS } from './awards/Awards';
import {SpaceName} from './SpaceName';
import {BoardColony, Board} from './Board';
import {CorporationName} from './CorporationName';
import {CardName} from './CardName';
import { ElysiumBoard } from './ElysiumBoard';
import { HellasBoard } from './HellasBoard';
import { BoardName } from './BoardName';
import { IColony } from './colonies/Colony';
import { ColonyDealer } from './colonies/ColonyDealer';
import { PlayerInterrupt } from './interrupts/PlayerInterrupt';
import { SelectOcean } from './interrupts/SelectOcean';
import { SelectResourceCard } from './interrupts/SelectResourceCard';
import { SelectColony } from './interrupts/SelectColony';
import { SelectRemoveColony } from './interrupts/SelectRemoveColony';
import { SelectPlantProductionDecrease } from './interrupts/SelectPlantProductionDecrease';
import { ICard } from './cards/ICard';

export class Game {
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
    public gameLog: Array<String> = [];
    public gameAge: number = 0; // Each log event increases it
    private unDraftedCards: Map<Player, Array<IProjectCard>> = new Map ();
    public interrupts: Array<PlayerInterrupt> = [];
    public monsInsuranceOwner: Player | undefined = undefined;
    public colonies: Array<IColony> = [];
    public colonyDealer: ColonyDealer = new ColonyDealer();
    public pendingOceans: number = 0;

    private tempMC: number = 0;
    private tempSteel: number = 0;
    private tempTitanium: number = 0;
    private tempPlants: number = 0;
    private tempHeat: number = 0;
    private tempTR: number = 0;
    private tempCards: Array<IProjectCard> = [];
    private tempHeatProduction: number = 0;
    private tempVenusScaleLevel: number = 0;
    private tempOceans: number = 0;

    constructor(
      public id: string,
      private players: Array<Player>,
      private first: Player,
      private preludeExtension: boolean = false,
      private draftVariant: boolean = false,
      public venusNextExtension: boolean = false,
      public coloniesExtension: boolean = false,
      customCorporationsList: boolean = false,
      corporationList: Array<CorporationCard> = [],
      public boardName: BoardName = BoardName.ORIGINAL
    ) {

      if (boardName === BoardName.ELYSIUM) {
        this.board = new ElysiumBoard();
        this.milestones.push(...ELYSIUM_MILESTONES);
        this.awards.push(...ELYSIUM_AWARDS);
      } else if (boardName === BoardName.HELLAS) {
        this.board = new HellasBoard();
        this.milestones.push(...HELLAS_MILESTONES);
        this.awards.push(...HELLAS_AWARDS);
      } else {        
        this.board = new OriginalBoard();
        this.milestones.push(...ORIGINAL_MILESTONES);
        this.awards.push(...ORIGINAL_AWARDS);
      }

      this.activePlayer = first;
      this.dealer = new Dealer(this.preludeExtension, this.venusNextExtension, this.coloniesExtension);
      
      // Single player game player starts with 14TR
      // and 2 neutral cities and forests on board
      if (players.length === 1) {
        this.setupSolo();
      }

      let corporationCards = ALL_CORPORATION_CARDS.slice();
      // Add prelude corporations cards
      if (this.preludeExtension) {
        corporationCards.push(...ALL_PRELUDE_CORPORATIONS);
      }

      // Add Venus Next corporations cards, board colonies and milestone / award
      if (this.venusNextExtension) {
        corporationCards.push(...ALL_VENUS_CORPORATIONS);
        this.milestones.push(...VENUS_MILESTONES);
        this.awards.push(...VENUS_AWARDS);
        this.board.spaces.push(
            new BoardColony(SpaceName.DAWN_CITY),
            new BoardColony(SpaceName.LUNA_METROPOLIS),
            new BoardColony(SpaceName.MAXWELL_BASE),
            new BoardColony(SpaceName.STRATOPOLIS)
        );
      }

      // Add colonies stuff
      if (this.coloniesExtension) {
        corporationCards.push(...ALL_COLONIES_CORPORATIONS);
        this.colonies = this.colonyDealer.drawColonies(players.length);
        if (this.players.length === 1) {
          players[0].setProduction(Resources.MEGACREDITS, -2);
          this.addInterrupt(new SelectRemoveColony(players[0], this));
        }
      }
      // Setup custom corporation list
      if (customCorporationsList && corporationList.length >= players.length * 2) {
        corporationCards = corporationList;
      }

      corporationCards = this.dealer.shuffleCards(corporationCards);

      // Give each player their corporation cards
      for (const player of players) {
        if (!player.beginner) {
          const firstCard: CorporationCard | undefined = corporationCards.pop();
          const secondCard: CorporationCard | undefined = corporationCards.pop();
          if (firstCard === undefined || secondCard === undefined) {
            throw new Error("No corporation card dealt for player");
          }
          player.dealtCorporationCards = [firstCard, secondCard];
          player.setWaitingFor(this.pickCorporationCard(player));
        } else {
          this.playCorporationCard(player, new BeginnerCorporation());
        }
      }
    }

    public addOceanInterrupt(player: Player, title: string): void {
      if (this.board.getOceansOnBoard() + this.pendingOceans  >= constants.MAX_OCEAN_TILES) {
        return;
      }
      this.pendingOceans++;
      this.addInterrupt(new SelectOcean(player, this,title));
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

    public addPlantProductionDecreaseInterrupt(player: Player, count: number = 1, title?: string): void {
      if (this.players.length === 1) {
        return;
      }
      this.addInterrupt(new SelectPlantProductionDecrease(player, this, count, title));
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
      if ( ! this.marsIsTerraformed()) return false;
      return this.preludeExtension ? this.generation <= 12 : this.generation <= 14;
    }

    public getAwardFundingCost(): number {
      return 8 + (6 * this.fundedAwards.length);
    }

    public fundAward(player: Player, award: IAward): void {
      if (this.allAwardsFunded()) {
        throw new Error('All awards already funded');
      }
      this.fundedAwards.push({
        award: award,
        player: player
      });
    }

    public giveAward(award: IAward): void {
      // Awards are disabled for 1 player games
      if (this.players.length === 1) return;

      const players: Array<Player> = this.players.slice();
      players.sort(
          (p1, p2) => award.getScore(p2, this) - award.getScore(p1, this)
      );
      if (award.getScore(players[0], this) > award.getScore(players[1], this)) {
        players[0].victoryPointsBreakdown.awards += 5;
        players[0].victoryPoints += 5;
        players.shift();
        if (players.length > 1) {
          if (
            award.getScore(players[0], this) > award.getScore(players[1], this)
          ) {
            players[0].victoryPointsBreakdown.awards += 2;
            players[0].victoryPoints += 2;
          } else { // We have at least 2 rank 2 players
            const score = award.getScore(players[0], this);
            while (
              players.length > 0 &&
              award.getScore(players[0], this) === score
            ) {
              players[0].victoryPointsBreakdown.awards += 2;
              players[0].victoryPoints += 2;
              players.shift();
            }
          }
        }
      } else { // We have at least 2 rank 1 players
        const score = award.getScore(players[0], this);
        while (
          players.length > 0 &&
          award.getScore(players[0], this) === score
        ) {
          players[0].victoryPointsBreakdown.awards += 5;
          players[0].victoryPoints += 5;
          players.shift();
        }
      }
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
      let dealtCards: Array<IProjectCard> = [];
      let corporation: CorporationCard;
      const result: AndOptions = new AndOptions(() => { this.playCorporationCard(player, corporation); return undefined; });
      for (let i = 0; i < 10; i++) {
        dealtCards.push(this.dealer.dealCard());
      }

      result.title = "Select corporation and initial cards";
      result.options.push(
        new SelectCard<CorporationCard>(
          'Select corporation', player.dealtCorporationCards,
          (foundCards: Array<CorporationCard>) => {
            corporation = foundCards[0];
            return undefined;
          }
        )
      );

      if (this.preludeExtension) {
        let preludeDealtCards: Array<IProjectCard> = [];

        for (let i = 0; i < 4; i++) {
          preludeDealtCards.push(this.dealer.dealPreludeCard());
        }

        result.options.push(
          new SelectCard(
            'Select 2 Prelude cards', preludeDealtCards,
            (preludeCards: Array<IProjectCard>) => {
              player.preludeCardsInHand.push(preludeCards[0], preludeCards[1]);
              return undefined;
            }, 2, 2
          )
        );
      }

      result.options.push(
        new SelectCard(
          'Select initial cards to buy', dealtCards,
          (foundCards: Array<IProjectCard>) => {
            for (const dealt of dealtCards) {
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

    private hasPassedThisActionPhase(player: Player): boolean {
      return this.passedPlayers.has(player);
    }

    private incrementFirstPlayer(): void {
      let firstIndex: number = this.players.indexOf(this.first);
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
      this.players.forEach((player) => {
        player.terraformRatingAtGenerationStart = player.terraformRating;
      });
      this.runDraftRound();
    }

    private gameIsOver(): boolean {
      // Single player game is done after generation 14 or 12 with prelude
      if (this.players.length === 1) {
        if (this.generation === 14 || (this.generation === 12 && this.preludeExtension)) return true;
      } else {
        return this.marsIsTerraformed();
      }
      return false;      
    }

    private gotoProductionPhase(): void {
      this.passedPlayers.clear();
      this.players.forEach((player) => {
        player.runProductionPhase();
      });

      if (this.gameIsOver()) {
        this.gotoFinalGreeneryPlacement();
        return;
      } 
      // Venus Next Solar phase
      if (this.venusNextExtension) {
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
      this.generation++;
      this.incrementFirstPlayer();
      if (this.draftVariant) {
        this.gotoDraftingPhase();
      } else {
        this.gotoResearchPhase();
      }
    }

    private gotoWorldGovernmentTerraforming() {
      //Snapshot player's resources
      this.tempMC = this.first.megaCredits;
      this.tempSteel = this.first.steel;
      this.tempTitanium = this.first.titanium;
      this.tempPlants = this.first.plants;
      this.tempHeat = this.first.heat;
      this.tempTR = this.first.terraformRating;
      this.tempCards = this.first.cardsInHand;
      this.tempHeatProduction = this.first.getProduction(Resources.HEAT);
      this.tempVenusScaleLevel = this.venusScaleLevel;
      this.tempOceans = this.board.getOceansOnBoard();


      this.first.worldGovernmentTerraforming(this);
    }

    public doneWorldGovernmentTerraforming() {
      //Revert snapshoted player's resources
      this.first.megaCredits = this.tempMC;
      this.first.steel = this.tempSteel;
      this.first.titanium = this.tempTitanium;
      this.first.plants = this.tempPlants;
      this.first.heat = this.tempHeat;
      this.first.terraformRating = this.tempTR;
      this.first.cardsInHand = this.tempCards;

      if (this.first.getProduction(Resources.HEAT) > this.tempHeatProduction) {
        this.first.setProduction(Resources.HEAT, this.tempHeatProduction - this.first.getProduction(Resources.HEAT));
      }

      // Check for Aphrodite corporation
      if (this.tempVenusScaleLevel < this.venusScaleLevel 
          && this.first.isCorporation(CorporationName.APHRODITE)) {
            this.first.megaCredits += 2;
      }

      //Check for arctic algae
      if (this.tempOceans < this.board.getOceansOnBoard() && this.first.cardIsInEffect(CardName.ARCTIC_ALGAE)) {
          this.first.plants += 2;
      }     

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
      this.playerIsFinishedTakingActions();
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
          interrupt.player.setWaitingFor(interrupt.playerInput);
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
        throw new Error('Did not find player');
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
      if (this.phase == Phase.END) return;
      this.phase = Phase.END;

      // Give players any victory points from cards and corporations
      this.players.forEach((player) => {
        if (player.corporationCard !== undefined && player.corporationCard.getVictoryPoints !== undefined) {
          player.victoryPoints += player.corporationCard.getVictoryPoints(player, this);
          player.victoryPointsBreakdown.VPdetails.push(player.corporationCard.name + " : " + player.corporationCard.getVictoryPoints(player, this));
        }
        for (let playedCard of player.playedCards) {
          if (playedCard.getVictoryPoints !== undefined) {
            player.victoryPoints += playedCard.getVictoryPoints(player, this);
            player.victoryPointsBreakdown.VPdetails.push(playedCard.name + " : " + playedCard.getVictoryPoints(player, this));
          }
        }
        player.victoryPointsBreakdown.victoryPoints = player.victoryPoints;
      });

      // TR is converted in victory points
      this.players.forEach((player) => {
        player.victoryPointsBreakdown.terraformRating = player.terraformRating;
        player.victoryPoints += player.terraformRating;
      });

      // Distribute awards
      this.fundedAwards.forEach((fundedAward) => {
        this.giveAward(fundedAward.award);
      });

      // Give 5 victory points for each claimed millestone
      for (const millestone of this.claimedMilestones) {
        millestone.player.victoryPointsBreakdown.milestones += 5;
        millestone.player.victoryPoints += 5;
      }

      const spaces = this.board.spaces;
      spaces.forEach((space) => {
        // Give victory point for each greenery tile
        if (
          space.tile &&
          space.tile.tileType === TileType.GREENERY &&
          space.player !== undefined) {
            space.player.victoryPointsBreakdown.greenery += 1;
            space.player.victoryPoints++;
        }
        // Give victory point for each greenery adjacent to city tile
        if (
          space.tile &&
          space.tile.tileType === TileType.CITY &&
          space.player !== undefined
        ) {
          const adjacent = this.board.getAdjacentSpaces(space);
          for (const adj of adjacent) {
            if (adj.tile && adj.tile.tileType === TileType.GREENERY) {
              space.player.victoryPointsBreakdown.city += 1;
              space.player.victoryPoints++;
            }
          }
        }
      });

      this.players.forEach((player) => {
        player.victoryPointsBreakdown.updateTotal();
      });
        
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
        throw new Error('Was no player left to place final greenery');
      }
    }

    private startFinalGreeneryPlacement(player: Player) {
      this.activePlayer = player;
      player.takeActionForFinalGreenery(this);
    }

    private startActionsForPlayer(player: Player) {
      this.activePlayer = player;
      player.actionsTakenThisRound = 0;
      player.takeAction(this);
    }

    public increaseOxygenLevel(
        player: Player, steps: 1 | 2): SelectSpace | undefined {
      if (this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL) {
        return undefined;
      }
      if (steps === 2 && this.oxygenLevel + steps > constants.MAX_OXYGEN_LEVEL) {
        return this.increaseOxygenLevel(player, 1);
      }
      this.oxygenLevel += steps;
      player.terraformRating += steps;
      if (this.oxygenLevel === 8 || (steps === 2 && this.oxygenLevel === 9)) {
        return this.increaseTemperature(player, 1);
      }
      return undefined;
    }

    public getOxygenLevel(): number {
      return this.oxygenLevel;
    }

    public increaseVenusScaleLevel(
      player: Player, steps: 1 | 2 | 3): SelectSpace | undefined {
    if (this.venusScaleLevel >= constants.MAX_VENUS_SCALE) {
      return undefined;
    }
    if (steps > 1 && this.venusScaleLevel + 2 * steps > constants.MAX_VENUS_SCALE) {
      steps = (steps == 3) ? 2 : 1; // typing disallows decrement
      return this.increaseVenusScaleLevel(player, steps);
    }
    this.venusScaleLevel += 2 * steps;
    player.terraformRating += steps;

    // Check for Aphrodite corporation
    this.players.forEach((player) => {
      if (player.isCorporation(CorporationName.APHRODITE)) {
        player.megaCredits += 2 * steps;
      }
    });

    if (this.venusScaleLevel === 8 
        || (steps === 2 && this.venusScaleLevel === 10) 
        || (steps === 3 && this.venusScaleLevel === 12)
    ) {
      player.cardsInHand.push(this.dealer.dealCard());
    }

    if (this.venusScaleLevel === 16 
        || (steps === 2 && this.venusScaleLevel === 18) 
        || (steps === 3 && this.venusScaleLevel === 20)
    ) {
      player.terraformRating++;
    }    

    return undefined;
  }

  public getVenusScaleLevel(): number {
    return this.venusScaleLevel;
  }

    public increaseTemperature(
        player: Player, steps: 1 | 2 | 3): SelectSpace | undefined {
      if (this.temperature >= constants.MAX_TEMPERATURE) {
        return undefined;
      }
      if (steps > 1 && this.temperature + 2 * steps > constants.MAX_TEMPERATURE) {
        steps = (steps == 3) ? 2 : 1; // typing disallows decrement
        return this.increaseTemperature(player, steps);
      }
      this.temperature += 2 * steps;
      player.terraformRating += steps;
      // BONUS FOR HEAT PRODUCTION AT -20 and -24
      // BONUS FOR OCEAN TILE AT 0
      if (steps === 3 && this.temperature === -20) {
        player.setProduction(Resources.HEAT,2);
      } else if (this.temperature === -24 || this.temperature === -20 ||
            (
              (steps === 2 || steps === 3) &&
              (this.temperature === -22 || this.temperature === -18)
            ) ||
            (steps === 3 && this.temperature === -16)
      ) {
        player.setProduction(Resources.HEAT);;
      } else if (
        (
          this.temperature === 0 ||
          ((steps === 2 || steps === 3) && this.temperature === 2) ||
          (steps === 3 && this.temperature === 4)
        ) && this.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES
      ) {
        return new SelectSpace(
            'Select space for ocean from temperature increase',
            this.board.getAvailableSpacesForOcean(player),
            (space: ISpace) => {
              this.addOceanTile(player, space.id);
              return undefined;
            }
        );
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
        throw new Error('Player not found');
      }
      return found[0];
    }

    public getSpace(id: string): ISpace {
      const matchedSpaces = this.board.spaces.filter((space) => space.id === id);
      if (matchedSpaces.length === 1) {
        return matchedSpaces[0];
      }
      throw new Error('Error with getting space');
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
        space: ISpace, tile: ITile): void {
      if (space.tile !== undefined) {
        throw new Error('Selected space is occupied');
      }
      // Hellas special requirements ocean tile
      if (space.id === SpaceName.HELLAS_OCEAN_TILE 
          && this.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES
          && this.boardName === BoardName.HELLAS) {
          let selectOcean = new SelectSpace(
            'Select space for ocean tile',
            this.board.getAvailableSpacesForOcean(player),
            (space: ISpace) => {
              this.addOceanTile(player, space.id);
              player.megaCredits -= 6;
              return undefined;
            }
          );


          selectOcean.onend = () => { 
            player.takeAction(this);
          }

          let interrupt = {
            player: player,
            playerInput: selectOcean
          };
          this.interrupts.push(interrupt);
      }

      // Land claim a player can claim land for themselves
      if (space.player !== undefined && space.player !== player) {
        throw new Error('This space is land claimed by ' + space.player.name);
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

      if (tile.tileType !== TileType.OCEAN) {
        space.player = player;
      }

      space.tile = tile;
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
      
      this.tilePlaced(space);

    }
    private tilePlaced(space: ISpace) {
      this.players.forEach((player) => {
        if (player.corporationCard !== undefined &&
            player.corporationCard.onTilePlaced !== undefined) {
          player.corporationCard.onTilePlaced(player, space, this);
        }
        player.playedCards.forEach((playedCard) => {
          if (playedCard.onTilePlaced !== undefined) {
            playedCard.onTilePlaced(player, space, this);
          }
        });
      });
    }
    public addGreenery(
        player: Player, spaceId: string,
        spaceType: SpaceType = SpaceType.LAND): SelectSpace | undefined {
      this.addTile(player, spaceType, this.getSpace(spaceId), {
        tileType: TileType.GREENERY
      });
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
        spaceType: SpaceType = SpaceType.OCEAN): void {
      if (this.board.getOceansOnBoard() === constants.MAX_OCEAN_TILES) {
        return;
      }
      this.addTile(player, spaceType, this.getSpace(spaceId), {
        tileType: TileType.OCEAN
      });
      player.terraformRating++;
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
    public getPlayedCardsWithAnimals(): Array<IProjectCard> {
      const result: Array<IProjectCard> = [];
      this.players.forEach((player) => {
        player.playedCards.forEach((card) => {
          if (card.resourceType === ResourceType.ANIMAL) {
            result.push(card);
          }
        });
      });
      return result;
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

    public log(message: String) {
      this.gameLog.push(message);
      this.gameAge++;
      if (this.gameLog.length > 10 ) {
        (this.gameLog.shift());
      }
    }

    private setupSolo() {
      this.players[0].terraformRating = 14;
      this.players[0].terraformRatingAtGenerationStart = 14;
      // Single player add neutral player
      // put 2 neutrals cities on board with adjacent forest
      const neutral = new Player('neutral', Color.NEUTRAL, true);
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
}

