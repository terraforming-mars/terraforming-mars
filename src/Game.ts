import {Player} from './Player';
import {Dealer} from './Dealer';
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
import {SpaceName} from './SpaceName';
import {AndOptions} from './inputs/AndOptions';
import {PlayerInput} from './PlayerInput';
import {Phase} from './Phase';
import {ClaimedMilestone} from './ClaimedMilestone';
import {FundedAward} from './FundedAward';
import {IMilestone} from './milestones/IMilestone';
import {ResourceType} from './ResourceType';
import * as constants from './constants';
import {Color} from './Color';
import {ALL_CORPORATION_CARDS} from './Dealer';
import {ALL_PRELUDE_CORPORATIONS} from './Dealer';
import {IAward} from './awards/IAward';
import {Tags} from './cards/Tags';

export class Game {
    public activePlayer: Player;
    public claimedMilestones: Array<ClaimedMilestone> = [];
    public dealer: Dealer;
    public fundedAwards: Array<FundedAward> = [];
    public generation: number = 1;
    private draftRound: number = 1;
    public phase: Phase = Phase.RESEARCH;
    private donePlayers: Set<Player> = new Set<Player>();
    private oxygenLevel: number = constants.MIN_OXYGEN_LEVEL;
    private passedPlayers: Set<Player> = new Set<Player>();
    private researchedPlayers: Set<Player> = new Set<Player>();
    private draftedPlayers: Set<Player> = new Set<Player>();
    private originalBoard = new OriginalBoard();
    public spaces: Array<ISpace>;
    private temperature: number = constants.MIN_TEMPERATURE;
    public gameLog: Array<String> = [];
    public gameAge: number = 0; // Each log event increases it
    private unDraftedCards: Map<Player, Array<IProjectCard>> = new Map ();

    constructor(
      public id: string,
      private players: Array<Player>,
      private first: Player,
      private preludeExtension: boolean = false,
      private draftVariant: boolean = false
    ) {
      this.spaces = this.originalBoard.spaces;
      this.activePlayer = first;
      this.preludeExtension = preludeExtension;
      this.draftVariant = draftVariant;
      this.dealer = new Dealer(this.preludeExtension);

      // Single player game player starts with 14TR
      // and 2 neutral cities and forests on board
      if (players.length === 1) {
        this.setupSolo();
      }

      let corporationCards = this.dealer.shuffleCards(ALL_CORPORATION_CARDS);
      // Add prelude corporations cards
      if (this.preludeExtension) {
        corporationCards.push(...ALL_PRELUDE_CORPORATIONS);
        corporationCards = this.dealer.shuffleCards(corporationCards);
      }

      // Give each player their corporation cards
      for (const player of players) {
        if (!player.beginner) {
          player.dealtCorporationCards = [
            corporationCards.pop(),
            corporationCards.pop()
          ];
          player.setWaitingFor(this.pickCorporationCard(player));
        } else {
          this.playCorporationCard(player, new BeginnerCorporation());
        }
      }
    }

    public getCardOwner(card: IProjectCard): Player {
      for (const p of this.getPlayers()) {
        for (const c of p.playedCards) {
          if (c.name === card.name) return p;
        }
      }
      throw new Error('No card owner found')
    }

    public getPreludeExtension(): boolean {
      return this.preludeExtension;
    }

    public getSpaceByTileCard(cardName: string): ISpace | undefined {
      return this.spaces.find(
          (space) => space.tile !== undefined && space.tile.card === cardName
      );
    }

    public milestoneClaimed(milestone: IMilestone): boolean {
      return this.claimedMilestones.find(
          (claimedMilestone) => claimedMilestone.milestone === milestone
      ) !== undefined;
    }

    public noOceansAvailable(): boolean {
      return this.getOceansOnBoard() >= constants.MAX_OCEAN_TILES;
    }

    private marsIsTerraformed(): boolean {
      return this.oxygenLevel >= constants.MAX_OXYGEN_LEVEL &&
             this.temperature >= constants.MAX_TEMPERATURE &&
             this.getOceansOnBoard() === constants.MAX_OCEAN_TILES;
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
        player.megaCredits -= cardsToPayFor * constants.CARD_COST;
      }

      this.playerIsFinishedWithResearchPhase(player);
    }

    private pickCorporationCard(player: Player): PlayerInput {
      const dealtCards: Array<IProjectCard> = [
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard(),
        this.dealer.dealCard()
      ];

      if (this.preludeExtension) {
        const preludeDealtCards: Array<IProjectCard> = [
          this.dealer.dealPreludeCard(),
          this.dealer.dealPreludeCard(),
          this.dealer.dealPreludeCard(),
          this.dealer.dealPreludeCard()
        ];

        let corporation: CorporationCard;
        return new AndOptions(
            () => {
              this.playCorporationCard(player, corporation);
              return undefined;
            },
            new SelectCard<CorporationCard>(
                'Select corporation', player.dealtCorporationCards,
                (foundCards: Array<CorporationCard>) => {
                  corporation = foundCards[0];
                  return undefined;
                }
            ),
            new SelectCard(
                'Select 2 Prelude cards',
                preludeDealtCards,
                (preludeCards: Array<IProjectCard>) => {
                  player.preludeCardsInHand.push(preludeCards[0], preludeCards[1]);
                  return undefined;
                }, 2, 2
            ),
            new SelectCard(
                'Select initial cards to buy',
                dealtCards,
                (foundCards: Array<IProjectCard>) => {
                // Pay for cards
                  for (const foundCard of foundCards) {
                    player.cardsInHand.push(foundCard);
                  }
                  for (const dealt of dealtCards) {
                    if (
                      foundCards.find(
                          (foundCard) => foundCard.name === dealt.name
                      ) === undefined
                    ) {
                      this.dealer.discard(dealt);
                    }
                  }
                  return undefined;
                }, 10, 0
            )
        );
      } else {
        let corporation: CorporationCard;
        return new AndOptions(
            () => {
              this.playCorporationCard(player, corporation);
              return undefined;
            },
            new SelectCard<CorporationCard>(
                'Select corporation',
                player.dealtCorporationCards,
                (foundCards: Array<CorporationCard>) => {
                  corporation = foundCards[0];
                  return undefined;
                }
            ),
            new SelectCard(
                'Select initial cards to buy',
                dealtCards,
                (foundCards: Array<IProjectCard>) => {
                // Pay for cards
                  for (const foundCard of foundCards) {
                    player.cardsInHand.push(foundCard);
                  }
                  for (const dealtCard of dealtCards) {
                    if (foundCards.find(
                        (foundCard) => foundCard.name === dealtCard.name
                    ) === undefined) {
                      this.dealer.discard(dealtCard);
                    }
                  }
                  return undefined;
                }, 10, 0
            )
        );
      }
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
          let cards = this.unDraftedCards.get(this.getNextDraft(player));
          this.unDraftedCards.delete(this.getNextDraft(player));
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
      if (this.marsIsTerraformed()) return true;

      // Single player game is done after generation 14 or 12 with prelude
      if (this.players.length === 1) {
        if (this.generation === 14 || (this.generation === 12 && this.preludeExtension)) return true;
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
      } else {
        
        this.generation++;
        this.incrementFirstPlayer();
       
        if (this.draftVariant) {
          this.gotoDraftingPhase();
        } else {
          this.gotoResearchPhase();
        }
      }
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
      this.playerIsFinishedTakingActions(player);
    }

    private hasResearched(player: Player): boolean {
      return this.researchedPlayers.has(player);
    }

    private hasDrafted(player: Player): boolean {
      return this.draftedPlayers.has(player);
    }

    private playerHasSpace(player: Player): boolean {
      return this.getAllSpaces().find(
          (space) => space.tile !== undefined &&
                   space.player === player &&
                   space.tile.tileType !== TileType.OCEAN
      ) !== undefined;
    }

    public getAvailableSpacesForCity(player: Player): Array<ISpace> {
      // A city cannot be adjacent to another city
      return this.getAvailableSpacesOnLand(player).filter(
        (space) => this.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType === TileType.CITY).length === 0
      );
    } 

    public getAvailableSpacesForGreenery(player: Player): Array<ISpace> {
      // Greenery must be placed by a space you own if you own a space
      if (this.playerHasSpace(player)) {
        return this.getAvailableSpacesOnLand(player)
            .filter(
                (space) => this.getAdjacentSpaces(space).find(
                    (adj) => adj.tile !== undefined &&
                                 adj.tile.tileType !== TileType.OCEAN &&
                                 adj.player === player
                ) !== undefined
            );
      }
      // Place anywhere if no space owned
      return this.getAvailableSpacesOnLand(player);
    }

    public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
      return this.getSpaces(SpaceType.LAND)
          .filter(
              (space) => space.id !== SpaceName.NOCTIS_CITY &&
                       space.tile === undefined &&
                       (space.player === undefined || space.player === player)
          );
    }

    public getAvailableSpacesForOcean(player: Player): Array<ISpace> {
      return this.getSpaces(SpaceType.OCEAN)
          .filter(
              (space) => space.tile === undefined &&
                       (space.player === undefined || space.player === player)
          );
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
            let lastCards  = this.unDraftedCards.get(this.getNextDraft(player));
            if (lastCards !== undefined && lastCards[0] !== undefined) {
              player.draftedCards.push(lastCards[0]);
            }
          });
        }
        this.gotoResearchPhase();
      }
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

    public playerIsFinishedTakingActions(player: Player): void {

      if (this.allPlayersHavePassed()) {
        this.gotoProductionPhase();
        return;
      }

      const nextPlayer = this.getNextPlayer(this.players, player);

      // Defensive coding to fail fast, if we don't find the next
      // player we are in an unexpected game state
      if (nextPlayer === undefined) {
        throw new Error('Did not find player');
      }

      if (!this.hasPassedThisActionPhase(nextPlayer)) {
        this.startActionsForPlayer(nextPlayer);
      } else {
        // Recursively find the next player
        this.playerIsFinishedTakingActions(nextPlayer);
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

      // Give players any victory points from cards
      this.players.forEach((player) => {
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

      const spaces = this.getAllSpaces();
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
          const adjacent = this.getAdjacentSpaces(space);
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
             this.getAvailableSpacesForGreenery(player).length > 0;
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
        player.heatProduction += 2;
      } else if (this.temperature === -24 || this.temperature === -20 ||
            (
              (steps === 2 || steps === 3) &&
              (this.temperature === -22 || this.temperature === -18)
            ) ||
            (steps === 3 && this.temperature === -16)
      ) {
        player.heatProduction++;
      } else if (
        (
          this.temperature === 0 ||
          ((steps === 2 || steps === 3) && this.temperature === 2) ||
          (steps === 3 && this.temperature === 4)
        ) && this.getOceansOnBoard() < constants.MAX_OCEAN_TILES
      ) {
        return new SelectSpace(
            'Select space for ocean from temperature increase',
            this.getAvailableSpacesForOcean(player),
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

    public getAllSpaces(): Array<ISpace> {
      return this.spaces;
    }

    public getSpace(id: string): ISpace {
      const matchedSpaces = this.spaces.filter((space) => space.id === id);
      if (matchedSpaces.length === 1) {
        return matchedSpaces[0];
      }
      throw new Error('Error with getting space');
    }
    public getCitiesInPlayOnMars(): number {
      return this.spaces.filter(
          (space) => space.tile !== undefined &&
                   space.tile.tileType === TileType.CITY &&
                   space.spaceType !== SpaceType.COLONY
      ).length;
    }
    public getCitiesInPlay(): number {
      return this.spaces.filter(
          (space) => space.tile !== undefined &&
                   space.tile.tileType === TileType.CITY
      ).length;
    }
    public getSpaceCount(tileType: TileType, player: Player): number {
      return this.spaces.filter(
          (space) => space.tile !== undefined &&
                   space.tile.tileType === tileType &&
                   space.player !== undefined &&
                   space.player === player
      ).length;
    }
    public getSpaces(spaceType: SpaceType): Array<ISpace> {
      return this.spaces.filter((space) => space.spaceType === spaceType);
    }
    public addTile(
        player: Player, spaceType: SpaceType,
        space: ISpace, tile: ITile): void {
      if (space.tile !== undefined) {
        throw new Error('Selected space is occupied');
      }
      // Land claim a player can claim land for themselves
      if (space.player !== undefined && space.player !== player) {
        throw new Error('This space is land claimed by ' + space.player.name);
      }
      if (space.spaceType !== spaceType) {
        throw new Error(
            `Select a valid location ${space.spaceType} is not ${spaceType}`
        );
      }
      space.player = player;
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
        }
      });
      this.getAdjacentSpaces(space).forEach((adjacentSpace) => {
        if (adjacentSpace.tile &&
            adjacentSpace.tile.tileType === TileType.OCEAN) {
          player.megaCredits += 2;
        }
      });
    }

    public getAdjacentSpaces(space: ISpace): Array<ISpace> {
      if (space.spaceType !== SpaceType.COLONY) {
        if (space.y < 0 || space.y > 8) {
          throw new Error('Unexpected space y value');
        }
        if (space.x < 0 || space.x > 8) {
          throw new Error('Unexpected space x value');
        }
        const leftSpace: Array<number> = [space.x - 1, space.y];
        const rightSpace: Array<number> = [space.x + 1, space.y];
        const topLeftSpace: Array<number> = [space.x, space.y - 1];
        const topRightSpace: Array<number> = [space.x, space.y - 1];
        const bottomLeftSpace: Array<number> = [space.x, space.y + 1];
        const bottomRightSpace: Array<number> = [space.x, space.y + 1];
        if (space.y < 4) {
          bottomLeftSpace[0]--;
          topRightSpace[0]++;
        } else if (space.y === 4) {
          bottomRightSpace[0]++;
          topRightSpace[0]++;
        } else {
          bottomRightSpace[0]++;
          topLeftSpace[0]--;
        }
        return this.spaces.filter((adj) => {
          return space !== adj && adj.spaceType !== SpaceType.COLONY && (
            (adj.x === leftSpace[0] && adj.y === leftSpace[1]) ||
            (adj.x === rightSpace[0] && adj.y === rightSpace[1]) ||
            (adj.x === topLeftSpace[0] && adj.y === topLeftSpace[1]) ||
            (adj.x === topRightSpace[0] && adj.y === topRightSpace[1]) ||
            (adj.x === bottomLeftSpace[0] && adj.y === bottomLeftSpace[1]) ||
            (adj.x === bottomRightSpace[0] && adj.y === bottomRightSpace[1])
          );
        });
      }
      return [];
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
      this.tilePlaced(this.getSpace(spaceId));
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
      this.tilePlaced(space);
    }
    public addOceanTile(
        player: Player, spaceId: string,
        spaceType: SpaceType = SpaceType.OCEAN): void {
      if (this.getOceansOnBoard() === constants.MAX_OCEAN_TILES) {
        return;
      }
      this.addTile(player, spaceType, this.getSpace(spaceId), {
        tileType: TileType.OCEAN
      });
      player.terraformRating++;
      this.tilePlaced(this.getSpace(spaceId));
    }
    public getOceansOnBoard(): number {
      return this.getSpaces(SpaceType.OCEAN).filter(
          (space) => space.tile !== undefined &&
                   space.tile.tileType === TileType.OCEAN
      ).length + this.getSpaces(SpaceType.LAND).filter(
          (space) => space.tile !== undefined &&
                   space.tile.tileType === TileType.OCEAN
      ).length;
    }
    public getPlayers(): Array<Player> {
      return this.players;
    }

    public getOtherAnimalCards(c: IProjectCard): Array<IProjectCard> {
      const result: Array<IProjectCard> = [];
      this.players.forEach((player) => {
        player.playedCards.forEach((card) => {
          if (card.name !== c.name &&
              card.resourceType === ResourceType.ANIMAL) {
            result.push(card);
          }
        });
      });
      return result;
    }

    public getOtherMicrobeCards(c: IProjectCard): Array<IProjectCard> {
      const result: Array<IProjectCard> = [];
      this.players.forEach((player) => {
        player.playedCards.forEach((card) => {
          if (card.name !== c.name &&
              card.resourceType === ResourceType.MICROBE) {
            result.push(card);
          }
        });
      });
      return result;
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
      for (let i = 0; i < this.players.length; i++) {
        for (let j = 0; j < this.players[i].playedCards.length; j++) {
          if (this.players[i].playedCards[j].name === name) {
            return this.players[i];
          }
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
      const space1 = this.originalBoard.getRandomCitySpace();
      this.addCityTile(neutral, space1.id, SpaceType.LAND);
      const fspace1 = this.originalBoard.getForestSpace(
          this.getAdjacentSpaces(space1)
      );
      this.addTile(neutral, SpaceType.LAND, fspace1, {
        tileType: TileType.GREENERY
      });
      const space2 = this.originalBoard.getRandomCitySpace(30);
      this.addCityTile(neutral, space2.id, SpaceType.LAND);
      const fspace2 = this.originalBoard.getForestSpace(
          this.getAdjacentSpaces(space2)
      );
      this.addTile(neutral, SpaceType.LAND, fspace2, {
        tileType: TileType.GREENERY
      });
      return undefined;
    }
}

