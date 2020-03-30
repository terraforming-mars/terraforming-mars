import {IProjectCard} from "./cards/IProjectCard";
import {CorporationCard} from "./cards/corporation/CorporationCard";
import {Tags} from "./cards/Tags";
import {PlayerInput} from "./PlayerInput";
import {CardType} from "./cards/CardType";
import {Color} from "./Color";
import {SelectCard} from "./inputs/SelectCard";
import {AndOptions} from "./inputs/AndOptions";
import { ICard } from "./cards/ICard";
import { OrOptions } from "./inputs/OrOptions";
import {Game} from "./Game";
import {HowToPay} from "./inputs/HowToPay";
import {SelectSpace} from "./inputs/SelectSpace";
import {ISpace} from "./ISpace";
import {SelectHowToPayForCard} from "./inputs/SelectHowToPayForCard";
import {SelectHowToPay} from "./inputs/SelectHowToPay";
import { SelectAmount } from "./inputs/SelectAmount";
import {SelectOption} from "./inputs/SelectOption";
import {SelectPlayer} from "./inputs/SelectPlayer";
import {IMilestone} from "./milestones/IMilestone";
import {StandardProjectType} from "./StandardProjectType";
import * as constants from "./constants";
import {IAward} from "./awards/IAward";
import {VictoryPointsBreakdown} from "./VictoryPointsBreakdown";
import {Resources} from "./Resources";
import {ResourceType} from "./ResourceType";
import {CardName} from "./CardName";
import {CorporationName} from "./CorporationName";
import {IColony} from "./colonies/Colony";
import {SelectGreenery} from "./interrupts/SelectGreenery";
import {SelectCity} from "./interrupts/SelectCity";
import {SpaceType} from "./SpaceType";
import {ITagCount} from "./ITagCount";
import {TileType} from "./TileType";
import {getProjectCardByName, getCorporationCardByName} from "./Dealer";
import {ILoadable} from "./ILoadable";
import {Database} from "./database/Database";
import {SerializedPlayer} from "./SerializedPlayer";
import {LogMessageType} from "./LogMessageType";
import {LogMessageData} from "./LogMessageData";
import {LogMessageDataType} from "./LogMessageDataType";

export class Player implements ILoadable<SerializedPlayer, Player>{
    public corporationCard: CorporationCard | undefined = undefined;
    public id: string;
    public canUseHeatAsMegaCredits: boolean = false;
    public plantsNeededForGreenery: number = 8;
    public dealtCorporationCards: Array<CorporationCard> = [];
    public powerPlantCost: number = 11;
    public titaniumValue: number = 3;
    public steelValue: number = 2;
    public megaCredits: number = 0;
    private megaCreditProduction: number = 0;
    public steel: number = 0;
    public titanium: number = 0;
    public energy: number = 0;
    private steelProduction: number = 0;
    private titaniumProduction: number = 0;
    private energyProduction: number = 0;
    public heat: number = 0;
    private heatProduction: number = 0;
    public plants: number = 0;
    private plantProduction: number = 0;
    public cardsInHand: Array<IProjectCard> = [];
    public preludeCardsInHand: Array<IProjectCard> = [];    
    public playedCards: Array<IProjectCard> = [];
    public draftedCards: Array<IProjectCard> = [];
    private generationPlayed: Map<string, number> = new Map<string, number>();
    public actionsTakenThisRound: number = 0;
    public terraformRating: number = 20;
    public terraformRatingAtGenerationStart: number = 20;
    public victoryPointsBreakdown = new VictoryPointsBreakdown();
    private actionsThisGeneration: Set<string> = new Set<string>();
    public lastCardPlayed: IProjectCard | undefined;
    private waitingFor?: PlayerInput;
    private waitingForCb?: () => void;
    public cardCost: number = constants.CARD_COST;
    public oceanBonus: number = constants.OCEAN_BONUS;
    public fleetSize: number = 1;
    public tradesThisTurn: number = 0;
    public colonyTradeOffset: number = 0;
    public colonyTradeDiscount: number = 0;

    constructor(
        public name: string,
        public color: Color,
        public beginner: boolean) {
      this.id = this.generateId();
    }

    public isCorporation(corporationName: CorporationName): boolean {
      return this.corporationCard !== undefined && this.corporationCard.name === corporationName;
    }

    public getProduction(resource: Resources): number {
      if (resource === Resources.MEGACREDITS) return this.megaCreditProduction;
      if (resource === Resources.STEEL) return this.steelProduction;
      if (resource === Resources.TITANIUM) return this.titaniumProduction;
      if (resource === Resources.PLANTS) return this.plantProduction;
      if (resource === Resources.ENERGY) return this.energyProduction;
      if (resource === Resources.HEAT) return this.heatProduction;
      throw new Error("Resource " + resource + " not found");
    }

    public getResource(resource: Resources): number {
      if (resource === Resources.MEGACREDITS) return this.megaCredits;
      if (resource === Resources.STEEL) return this.steel;
      if (resource === Resources.TITANIUM) return this.titanium;
      if (resource === Resources.PLANTS) return this.plants;
      if (resource === Resources.ENERGY) return this.energy;
      if (resource === Resources.HEAT) return this.heat;
      throw new Error("Resource " + resource + " not found");
    }


    private resolveMonsInsurance(game: Game) {
      if (game.monsInsuranceOwner !== undefined) {
        let retribution: number = Math.min(game.monsInsuranceOwner.megaCredits, 3);
        this.megaCredits += retribution;
        game.monsInsuranceOwner.setResource(Resources.MEGACREDITS,-3);
        if (retribution > 0) {
          game.log(
            LogMessageType.DEFAULT,
            "${0} received ${1} MC from ${2} owner (${3})",
            new LogMessageData(LogMessageDataType.PLAYER, this.name),
            new LogMessageData(LogMessageDataType.STRING, retribution.toString()),
            new LogMessageData(LogMessageDataType.CARD, "Mons Insurance"),
            new LogMessageData(LogMessageDataType.PLAYER, game.monsInsuranceOwner.name)
          );
        }
      }  
    }

    public setResource(resource: Resources, amount : number = 1, game? : Game, fromPlayer? : Player) {
      if (resource === Resources.MEGACREDITS) this.megaCredits = Math.max(0, this.megaCredits + amount);
      if (resource === Resources.STEEL) this.steel = Math.max(0, this.steel + amount);
      if (resource === Resources.TITANIUM) this.titanium = Math.max(0, this.titanium + amount);
      if (resource === Resources.PLANTS) this.plants = Math.max(0, this.plants + amount);
      if (resource === Resources.ENERGY) this.energy = Math.max(0, this.energy + amount);
      if (resource === Resources.HEAT) this.heat = Math.max(0, this.heat + amount);
      
      if (game !== undefined && fromPlayer !== undefined && amount < 0) {
        game.log(
          LogMessageType.DEFAULT,
          "${0}'s ${1} amount modified by ${2} by ${3}",
          new LogMessageData(LogMessageDataType.PLAYER, this.name),
          new LogMessageData(LogMessageDataType.STRING, resource),
          new LogMessageData(LogMessageDataType.STRING, amount.toString()),
          new LogMessageData(LogMessageDataType.PLAYER, fromPlayer.name)
        );
      }

      // Mons Insurance hook
      if (game !== undefined && game.monsInsuranceOwner !== undefined && amount < 0 && fromPlayer !== undefined) {
        this.resolveMonsInsurance(game);
      }
    }

    public setProduction(resource: Resources, amount : number = 1, game? : Game, fromPlayer? : Player) {

      if (resource === Resources.MEGACREDITS) this.megaCreditProduction = Math.max(-5, this.megaCreditProduction + amount);
      if (resource === Resources.STEEL) this.steelProduction = Math.max(0, this.steelProduction + amount);
      if (resource === Resources.TITANIUM) this.titaniumProduction = Math.max(0, this.titaniumProduction + amount);
      if (resource === Resources.PLANTS) this.plantProduction = Math.max(0, this.plantProduction + amount);
      if (resource === Resources.ENERGY) this.energyProduction = Math.max(0, this.energyProduction + amount);
      if (resource === Resources.HEAT) this.heatProduction = Math.max(0, this.heatProduction + amount);
      
      if (game !== undefined && fromPlayer !== undefined && amount < 0) {
        game.log(
          LogMessageType.DEFAULT,
          "${0}'s ${1} production modified by ${2} by ${3}",
          new LogMessageData(LogMessageDataType.PLAYER, this.name),
          new LogMessageData(LogMessageDataType.STRING, resource),
          new LogMessageData(LogMessageDataType.STRING, amount.toString()),
          new LogMessageData(LogMessageDataType.PLAYER, fromPlayer.name)
        );
      }

      //Manutech hook
      if (amount > 0 && this.corporationCard !== undefined && this.corporationCard.name === CardName.MANUTECH) {
        if (resource === Resources.MEGACREDITS) this.megaCredits += amount;
        if (resource === Resources.STEEL) this.steel += amount;
        if (resource === Resources.TITANIUM) this.titanium += amount;
        if (resource === Resources.PLANTS) this.plants += amount;
        if (resource === Resources.ENERGY) this.energy += amount;
        if (resource === Resources.HEAT) this.heat += amount;
      }

      // Mons Insurance hook  
      if (game !== undefined && game.monsInsuranceOwner !== undefined && amount < 0 && fromPlayer !== undefined) {
        this.resolveMonsInsurance(game);
      }

    };  

    public getActionsThisGeneration(): Set<string> {
      return this.actionsThisGeneration;
    }

    public setActionsThisGeneration(cardName: string): void {
      this.actionsThisGeneration.add(cardName);
      return;
    }

    public getVictoryPoints(game: Game): VictoryPointsBreakdown {

      // Reset victory points
      this.victoryPointsBreakdown = new VictoryPointsBreakdown();

      // Victory points from corporations
      if (this.corporationCard !== undefined && this.corporationCard.getVictoryPoints !== undefined) {
        this.victoryPointsBreakdown.setVictoryPoints("victoryPoints", this.corporationCard.getVictoryPoints(this, game), this.corporationCard.name);
      }

      // Victory points from cards
      for (let playedCard of this.playedCards) {
        if (playedCard.getVictoryPoints !== undefined) {
          this.victoryPointsBreakdown.setVictoryPoints("victoryPoints", playedCard.getVictoryPoints(this, game), playedCard.name);
        }
      }

      // Victory points from TR
      this.victoryPointsBreakdown.setVictoryPoints("terraformRating", this.terraformRating);

      // Victory points from awards
      this.giveAwards(game);

      // Victory points from milestones
      for (const milestone of game.claimedMilestones) {
        if (milestone.player !== undefined && milestone.player.id === this.id) {
          this.victoryPointsBreakdown.setVictoryPoints("milestones", 5, "Claimed "+milestone.milestone.name+" milestone");
        }
      }

      // Victory points from board
      game.board.spaces.forEach((space) => {

        // Victory points for greenery tiles
        if (space.tile && space.tile.tileType === TileType.GREENERY && space.player !== undefined && space.player.id === this.id) {
          this.victoryPointsBreakdown.setVictoryPoints("greenery", 1);
        }

        // Victory points for greenery tiles adjacent to cities
        if (space.tile && space.tile.tileType === TileType.CITY && space.player !== undefined && space.player.id === this.id) {
          const adjacent = game.board.getAdjacentSpaces(space);
          for (const adj of adjacent) {
            if (adj.tile && adj.tile.tileType === TileType.GREENERY) {
              this.victoryPointsBreakdown.setVictoryPoints("city", 1);
            }
          }
        }

      });

      this.victoryPointsBreakdown.updateTotal();
      return this.victoryPointsBreakdown;

    }

    public cardIsInEffect(cardName: CardName): boolean {
      return this.playedCards.find(
        (playedCard) => playedCard.name === cardName) !== undefined;      
    }

    public hasProtectedHabitats(): boolean {
      return this.cardIsInEffect(CardName.PROTECTED_HABITATS);
    }
    
    public removeAnimals(
        removingPlayer: Player,
        card: ICard,
        count: number,
        game: Game): void {
      if (removingPlayer !== this && this.hasProtectedHabitats()) {
        throw new Error("Can not remove animals due to protected habitats");
      }
      if (card.name === CardName.PETS) {
        throw new Error("Animals may not be removed from pets");
      }
      if (card.resourceCount === 0) {
        throw new Error(card.name + " does not have animals to remove");
      }
      this.removeResourceFrom(card, count, game, removingPlayer);
    }
    
    public removeMicrobes(
        removingPlayer: Player,
        card: ICard,
        count: number,
        game: Game): void {
      if (removingPlayer !== this && this.hasProtectedHabitats()) {
        throw new Error(
            "Can not remove microbes due to protected habitats"
        );
      }
      if (this.getResourcesOnCard(card) === 0) {
        throw new Error(card.name + " does not have microbes to remove");
      }
      this.removeResourceFrom(card, count, game, removingPlayer);
    }

    public getResourcesOnCard(card: ICard): number {
      if (card.resourceCount !== undefined) {
        return card.resourceCount;
      } else return 0;
    }

    public getResourcesOnCorporation():number {
      if (this.corporationCard !== undefined
        && this.corporationCard.resourceCount !== undefined) {
        return this.corporationCard.resourceCount;
      } else return 0;
    }  

    public getRequirementsBonus(game: Game, venusOnly?: boolean): number {
      let requirementsBonus: number = 0;
      if (
        this.corporationCard !== undefined &&
            this.corporationCard.getRequirementBonus !== undefined) {
              requirementsBonus += this.corporationCard.getRequirementBonus(this, game, venusOnly);
      }
      for (let playedCard of this.playedCards) {
        if (playedCard.getRequirementBonus !== undefined &&
           playedCard.getRequirementBonus(this, game)) {
            requirementsBonus += playedCard.getRequirementBonus(this, game);
        }
      }
      return requirementsBonus;
    }

    private generateId(): string {
      return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
    }
    public removeResourceFrom(card: ICard, count: number = 1, game? : Game, removingPlayer? : Player): void {
      if (card.resourceCount) {
        card.resourceCount = Math.max(card.resourceCount - count, 0);
        // Mons Insurance hook
        if (game !== undefined && removingPlayer !== undefined) {
          this.resolveMonsInsurance(game);
          game.log(
            LogMessageType.DEFAULT,
            "${0} looses ${1} resource(s) on ${2} by ${3}",
            new LogMessageData(LogMessageDataType.PLAYER, this.name),
            new LogMessageData(LogMessageDataType.STRING, count.toString()),
            new LogMessageData(LogMessageDataType.CARD, card.name),
            new LogMessageData(LogMessageDataType.PLAYER, removingPlayer.name)
          );
        }
      }
    }
    public addResourceTo(card: ICard, count: number = 1): void {
      if (card.resourceCount !== undefined) {
        card.resourceCount += count;
      }
    }

    public getCardsWithResources(): Array<ICard> {
      return this.playedCards.filter(
          (card) => card.resourceCount && card.resourceCount > 0
      );
    }

    public getResourceCards(resource: ResourceType): Array<ICard> {
      const result: Array<ICard> = [];
        this.playedCards.forEach((card) => {
          if (card.resourceType !== undefined && card.resourceType === resource) {
            result.push(card);
          }
        });

        if (this.corporationCard !== undefined && this.corporationCard.resourceType !== undefined && this.corporationCard.resourceType === resource) {
          result.push(this.corporationCard);
        }  

        return result;
    }  

    public getResourceCount(resource: ResourceType): number {
      let count: number = 0;
      this.playedCards.forEach((card) => {
        if (card.resourceType === resource) {
          count += this.getResourcesOnCard(card);
        }
      });

      if (this.corporationCard !== undefined && this.corporationCard.resourceType !== undefined && this.corporationCard.resourceType === resource) {
        count += this.getResourcesOnCard(this.corporationCard);
      }    
      return count;
    }

    public getAllTags(): Array<ITagCount> {
      let tags: Array<ITagCount> = [];
      tags.push({tag : Tags.CITY, count : this.getTagCount(Tags.CITY, false, false)} as ITagCount);
      tags.push({tag : Tags.EARTH, count : this.getTagCount(Tags.EARTH, false, false)} as ITagCount);
      tags.push({tag : Tags.ENERGY, count : this.getTagCount(Tags.ENERGY, false, false)} as ITagCount);
      tags.push({tag : Tags.JOVIAN, count : this.getTagCount(Tags.JOVIAN, false, false)} as ITagCount);
      tags.push({tag : Tags.MICROBES, count : this.getTagCount(Tags.MICROBES, false, false)} as ITagCount);
      tags.push({tag : Tags.PLANT, count : this.getTagCount(Tags.PLANT, false, false)} as ITagCount);
      tags.push({tag : Tags.SCIENCE, count : this.getTagCount(Tags.SCIENCE, false, false)} as ITagCount);
      tags.push({tag : Tags.SPACE, count : this.getTagCount(Tags.SPACE, false, false)} as ITagCount);
      tags.push({tag : Tags.STEEL, count : this.getTagCount(Tags.STEEL, false, false)} as ITagCount);
      tags.push({tag : Tags.VENUS, count : this.getTagCount(Tags.VENUS, false, false)} as ITagCount);
      tags.push({tag : Tags.WILDCARD, count : this.getTagCount(Tags.WILDCARD, false, false)} as ITagCount);
      tags.push({tag : Tags.ANIMAL, count : this.getTagCount(Tags.ANIMAL, false, false)} as ITagCount);
      tags.push({tag : Tags.EVENT, count : this.playedCards.filter(card => card.cardType === CardType.EVENT).length} as ITagCount);
      
      return tags.filter((tag) => tag.count > 0);
    }
    
    public getTagCount(tag: Tags, includeEventsTags:boolean = false, includeWildcardTags:boolean = true): number {
      let tagCount = 0;
      this.playedCards.forEach((card: IProjectCard) => {
        if ( ! includeEventsTags && card.cardType === CardType.EVENT) return;
        tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
      });
      if (this.corporationCard !== undefined) {
        tagCount += this.corporationCard.tags.filter(
            (cardTag) => cardTag === tag
        ).length;
      }
      if (tag === Tags.WILDCARD) {
        return tagCount;
      };
      if (includeWildcardTags) {
          return tagCount + this.getTagCount(Tags.WILDCARD);
      } else {
        return tagCount;
      }
    }

    public getMultipleTagCount(tags: Array<Tags>): number {
      let tagCount = 0;
      tags.forEach(tag => {
        tagCount += this.getTagCount(tag, false, false);
      });
      return tagCount + this.getTagCount(Tags.WILDCARD);
    }  

    public checkMultipleTagPresence(tags: Array<Tags>): boolean {
      var distinctCount = 0;
      tags.forEach(tag => {
        if (this.getTagCount(tag, false, false) > 0) {
          distinctCount++;
        }  
      });
      if (distinctCount + this.getTagCount(Tags.WILDCARD) >= tags.length) {
        return true;
      }
      return false;
    }

    public getCard(cards: Array<IProjectCard>, cardName: string): IProjectCard {
      const foundCards = cards.filter((card) => card.name === cardName);
      if (foundCards.length === 0) {
        throw new Error("Card not found");
      }
      return foundCards[0];
    }
    private runInputCb(game: Game, result: PlayerInput | undefined): void {
        if (result !== undefined) {
            game.interrupts.push({
                player: this,
                playerInput: result
            });
        }    
    }
    private runInput(
        game: Game,
        input: Array<Array<string>>,
        pi: PlayerInput): void {
      if (pi instanceof AndOptions) {
        const waiting: AndOptions = pi;
        if (input.length !== waiting.options.length) {
          throw new Error("Not all options provided");
        }
        for (let i = 0; i < input.length; i++) {
          this.runInput(game, [input[i]], waiting.options[i]);
        }
        this.runInputCb(game, pi.cb());
      } else if (pi instanceof SelectAmount) {
        const waiting: SelectAmount = pi;
        if (input.length !== 1) {
          throw new Error("Incorrect options provided");
        }
        if (input[0].length !== 1) {
          throw new Error("Incorrect number of amounts provided");
        }
        const amount: number = parseInt(input[0][0]);
        if (isNaN(amount)) {
          throw new Error("Number not provided for amount");
        }
        if (amount > waiting.max) {
          throw new Error("Amount provided too high");
        }
        if (amount < 0) {
          throw new Error("Amount provided too low");
        }
        this.runInputCb(game, pi.cb(amount));
      } else if (pi instanceof SelectOption) {
        this.runInputCb(game, pi.cb());
      } else if (pi instanceof OrOptions) {
        const waiting: OrOptions = pi;
        const optionIndex = parseInt(input[0][0]);
        const remainingInput = input[0].slice();
        // Remove option index to process option
        remainingInput.shift();
        this.runInput(game, [remainingInput], waiting.options[optionIndex]);
      } else if (pi instanceof SelectHowToPayForCard) {
        if (input.length !== 1 || input[0].length !== 2) {
          throw new Error("Incorrect options provided");
        }
        const foundCard: IProjectCard = this.getCard(pi.cards, input[0][0]);
        const payMethod: HowToPay = {
          steel: 0,
          heat: 0,
          titanium: 0,
          megaCredits: 0,
          microbes: 0,
          floaters: 0
        };
        try {
          const parsedInput: {[x: string]: number} =
                    JSON.parse(input[0][1]);
          if (
            this.canUseSteel(foundCard) &&
                    parsedInput.steel !== undefined) {
            payMethod.steel = parsedInput.steel;
          }
          if (
            this.canUseTitanium(foundCard) &&
                    parsedInput.titanium !== undefined) {
            payMethod.titanium = parsedInput.titanium;
          }
          if (parsedInput.megaCredits !== undefined) {
            payMethod.megaCredits = parsedInput.megaCredits;
          }
          if (this.canUseHeatAsMegaCredits) {
            if (parsedInput.heat !== undefined) {
              payMethod.heat = parsedInput.heat;
            }
          }
          if (parsedInput.microbes !== undefined) {
            payMethod.microbes = parsedInput.microbes;
          }
          if (parsedInput.floaters !== undefined) {
            payMethod.floaters = parsedInput.floaters;
          }

        } catch (err) {
          throw new Error("Unable to parse input " + err);
        }
        this.runInputCb(game, pi.cb(foundCard, payMethod));
      } else if (pi instanceof SelectCard) {
        if (input.length !== 1) {
          throw new Error("Incorrect options provided");
        }
        const mappedCards: Array<ICard> = [];
        for (const cardName of input[0]) {
          mappedCards.push(this.getCard(pi.cards, cardName));
        }
        if (input[0].length < pi.minCardsToSelect) {
          throw new Error("Not enough cards selected");
        }
        if (input[0].length > pi.maxCardsToSelect) {
          throw new Error("Too many cards selected");
        }
        if (mappedCards.length !== input[0].length) {
          throw new Error("Not all cards found");
        }
        this.runInputCb(game, pi.cb(mappedCards));
      } else if (pi instanceof SelectAmount) {
        if (input.length !== 1) {
          throw new Error("Incorrect options provided");
        }
        if (input[0].length !== 1) {
          throw new Error("Too many amounts provided");
        }
        if (isNaN(parseInt(input[0][0]))) {
          throw new Error("Amount is not a number");
        }
        this.runInputCb(game, pi.cb(parseInt(input[0][0])));
      } else if (pi instanceof SelectSpace) {
        if (input.length !== 1) {
          throw new Error("Incorrect options provided");
        }
        if (input[0].length !== 1) {
          throw new Error("Too many spaces provided");
        }
        const foundSpace = pi.availableSpaces.find(
            (space) => space.id === input[0][0]
        );
        if (foundSpace === undefined) {
          throw new Error("Space not available");
        }
        this.runInputCb(game, pi.cb(foundSpace));
      } else if (pi instanceof SelectPlayer) {
        if (input.length !== 1) {
          throw new Error("Incorrect options provided");
        }
        if (input[0].length !== 1) {
          throw new Error("Invalid players array provided");
        }
        const foundPlayer = pi.players.find(
            (player) => player.id === input[0][0]
        );
        if (foundPlayer === undefined) {
          throw new Error("Player not available");
        }
        this.runInputCb(game, pi.cb(foundPlayer));
      } else if (pi instanceof SelectHowToPay) {
        if (input.length !== 1) {
          throw new Error("Incorrect options provided");
        }
        if (input[0].length !== 1) {
          throw new Error("Incorrect input provided");
        }
        const payMethod: HowToPay = {
          steel: 0,
          heat: 0,
          titanium: 0,
          megaCredits: 0,
          microbes: 0, 
          floaters: 0
        };
        if (this.canUseHeatAsMegaCredits) {
          payMethod.heat = 0;
        }
        try {
          const parsedInput: {[x: string]: number} =
                    JSON.parse(input[0][0]);
          if (parsedInput.steel !== undefined) {
            payMethod.steel = parsedInput.steel;
          } else {
            throw new Error("Steel not provided, bad input");
          }
          if (parsedInput.titanium !== undefined) {
            payMethod.titanium = parsedInput.titanium;
          } else {
            throw new Error("Titanium not provided, bad input");
          }
          if (parsedInput.megaCredits !== undefined) {
            payMethod.megaCredits = parsedInput.megaCredits;
          } else {
            throw new Error("Mega credits not provided, bad input");
          }
          if (this.canUseHeatAsMegaCredits) {
            if (parsedInput.heat !== undefined) {
              payMethod.heat = parsedInput.heat;
            } else {
              throw new Error("Heat not provided, bad input");
            }
          }
          if (parsedInput.microbes !== undefined) {
              payMethod.microbes = parsedInput.microbes;
          }
        } catch (err) {
          throw new Error("Unable to parse input " + err);
        }
        this.runInputCb(game, pi.cb(payMethod));
      } else {
        throw new Error("Unsupported waitingFor");
      }
    }

    private getPlayableActionCards(game: Game): Array<ICard> {
      const result: Array<ICard> = [];
      if (
        this.corporationCard !== undefined &&
            !this.actionsThisGeneration.has(this.corporationCard.name) &&
            this.corporationCard.action !== undefined &&
            this.corporationCard.canAct !== undefined &&
            this.corporationCard.canAct(this, game)) {
        result.push(this.corporationCard);
      }
      for (const playedCard of this.playedCards) {
        if (
          playedCard.action !== undefined &&
                playedCard.canAct !== undefined &&
                !this.actionsThisGeneration.has(playedCard.name) &&
                playedCard.canAct(this, game)) {
          result.push(playedCard);
        }
      }
      return result;
    }

    public runProductionPhase(): void {
      this.actionsThisGeneration.clear();
      this.tradesThisTurn = 0;
      this.megaCredits += this.megaCreditProduction + this.terraformRating;
      this.heat += this.energy;
      this.heat += this.heatProduction;
      this.energy = this.energyProduction;
      this.titanium += this.titaniumProduction;
      this.steel += this.steelProduction;
      this.plants += this.plantProduction;

      if (this.corporationCard !== undefined && this.corporationCard.onProductionPhase !== undefined) {
        this.corporationCard.onProductionPhase(this);
      }

    }

    public worldGovernmentTerraforming(game: Game) {

      // Test if this is needed, usefull for solo play
      if (game.getTemperature() >= constants.MAX_TEMPERATURE 
        && game.getOxygenLevel() >= constants.MAX_OXYGEN_LEVEL
        && game.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES
        && game.getVenusScaleLevel() >= constants.MAX_VENUS_SCALE) {
          game.doneWorldGovernmentTerraforming();
          return;
      }

      const action: OrOptions = new OrOptions();
      action.title = "Select action for World Government Terraforming";
      if (game.getTemperature() < constants.MAX_TEMPERATURE) {
        action.options.push(
          new SelectOption("Increase temperature", () => {
            game.increaseTemperature(this,1, true);
            game.log(
              LogMessageType.DEFAULT,
              "${0} acted as World Government and increased temperature",
              new LogMessageData(LogMessageDataType.PLAYER, this.name)
            );
            return undefined;
          })
        );
      }
      if (game.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL) {
        action.options.push(
          new SelectOption("Increase oxygen", () => {
            game.increaseOxygenLevel(this,1, true);
            game.log(
              LogMessageType.DEFAULT,
              "${0} acted as World Government and increased oxygen level",
              new LogMessageData(LogMessageDataType.PLAYER, this.name)
            );
            return undefined;
          })
        );
      }
      if (game.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
        action.options.push(
          new SelectSpace(
            "Add an ocean",
            game.board.getAvailableSpacesForOcean(this), (space) => {
              game.addOceanTile(this, space.id, SpaceType.OCEAN, true);
              game.log(
                LogMessageType.DEFAULT,
                "${0} acted as World Government and increased oceans",
                new LogMessageData(LogMessageDataType.PLAYER, this.name)
              );
              return undefined;
            }
          )
        );
      }
      if (game.getVenusScaleLevel() < constants.MAX_VENUS_SCALE) {
        action.options.push(
          new SelectOption("Increase Venus scale", () => {
            game.increaseVenusScaleLevel(this,1, true);
            game.log(
              LogMessageType.DEFAULT,
              "${0} acted as World Government and increased Venus scale",
              new LogMessageData(LogMessageDataType.PLAYER, this.name)
            );
            return undefined;
          })
        );
      }

      this.setWaitingFor(action, () => {
        game.doneWorldGovernmentTerraforming();
      });
      return;
  }

    public runDraftPhase(game: Game, playerName: String, passedCards?: Array<IProjectCard>): void {
      let cards: Array<IProjectCard> = [];
      if (passedCards === undefined) {
        cards.push(
          game.dealer.dealCard(true),
          game.dealer.dealCard(true),
          game.dealer.dealCard(true),
          game.dealer.dealCard(true)
      ) } else { cards = passedCards}      

      this.setWaitingFor(
        new SelectCard(
          "Select a card to keep and pass the rest to " + playerName,
          cards,
          (foundCards: Array<IProjectCard>) => {
            this.draftedCards.push(foundCards[0]);
            cards = cards.filter((card) => card !== foundCards[0]);
            game.playerIsFinishedWithDraftingPhase(this,cards);
            return undefined;
          }, 1, 1
        ), () => { }
      );  
  }  

    public runResearchPhase(game: Game, draftVariant: boolean): void {
      let dealtCards: Array<IProjectCard> = [];
      if (!draftVariant) {
        dealtCards.push(
          game.dealer.dealCard(true),
          game.dealer.dealCard(true),
          game.dealer.dealCard(true),
          game.dealer.dealCard(true)
        );
      } else {
        dealtCards = this.draftedCards;
        this.draftedCards = [];
      }

      let htp: HowToPay = {
        steel: 0,
        titanium: 0,
        heat: 0,
        megaCredits: 0,
        microbes: 0,
        floaters: 0
      };

      let selectedCards: Array<IProjectCard> = [];

      const payForCards = () => {
        if (htp.heat > 0 && this.canUseHeatAsMegaCredits) {
          this.heat -= htp.heat;
          this.megaCredits -= (this.cardCost * selectedCards.length - htp.heat);
        } else {
          this.megaCredits -= this.cardCost * selectedCards.length;
        }  
        selectedCards.forEach((card) => {
          this.cardsInHand.push(card);
        });
        // Discard the cards which were not purchased.
        dealtCards
            .filter(
                (card) => selectedCards
                    .find(
                        (foundCard) => foundCard.name === card.name
                    ) === undefined
            )
            .forEach((card) => {
              game.dealer.discard(card);
            });
        game.log(
          LogMessageType.DEFAULT,
          "${0} bought ${1} card(s)",
          new LogMessageData(LogMessageDataType.PLAYER, this.name),
          new LogMessageData(LogMessageDataType.STRING, selectedCards.length.toString())
        );
        game.playerIsFinishedWithResearchPhase(this);
      };

      if (this.canUseHeatAsMegaCredits) {
        this.setWaitingFor(
            new AndOptions(() => {
              return undefined;
            },
            new SelectHowToPay(
                "Select how to pay for cards",
                false,
                false,
                true,
                0,
                (pay) => {
                  htp = pay;
                  return undefined;
                }
            ),
            new SelectCard(
                "Select which cards to take into hand",
                dealtCards,
                (foundCards: Array<IProjectCard>) => {
                  selectedCards = foundCards;
                  return undefined;
                }, 4, 0
            )
            ), () => { payForCards(); }
        );
      } else {
        this.setWaitingFor(
            new SelectCard(
                "Select which cards to take into hand",
                dealtCards,
                (foundCards: Array<IProjectCard>) => {
                  htp.megaCredits = foundCards.length * this.cardCost;
                  selectedCards = foundCards;
                  return undefined;
                }, 4, 0
            ), () => { payForCards(); }
        );
      }
    }

    public getCardCost(game: Game, card: IProjectCard): number {
      let cost: number = card.cost;
      this.playedCards.forEach((playedCard) => {
        if (playedCard.getCardDiscount !== undefined) {
          cost -= playedCard.getCardDiscount(this, game, card);
        }
      });
      
      // Check corporation too
      if (this.corporationCard !== undefined && this.corporationCard.getCardDiscount !== undefined) {
        cost -= this.corporationCard.getCardDiscount(this, game, card);
      }
      return Math.max(cost, 0);
    }

    private addPlayedCard(game: Game, card: IProjectCard): void {
      this.playedCards.push(card);
      game.log(
        LogMessageType.DEFAULT,
        "${0} played ${1}",
        new LogMessageData(LogMessageDataType.PLAYER, this.name),
        new LogMessageData(LogMessageDataType.CARD, card.name)
      );
      this.lastCardPlayed = card;
      this.generationPlayed.set(card.name, game.generation);
    }

    private canUseSteel(card: ICard): boolean {
      return card.tags.indexOf(Tags.STEEL) !== -1;
    }

    private canUseTitanium(card: ICard): boolean {
      return card.tags.indexOf(Tags.SPACE) !== -1;
    }

    private playPreludeCard(game: Game): PlayerInput {
      return new SelectCard(
        "Select prelude card to play",
        this.preludeCardsInHand,
        (foundCards: Array<IProjectCard>) => {
            return this.playCard(game, foundCards[0]);
        },
        1,
        1
      );
    }

    private playProjectCard(game: Game): PlayerInput {
      const cb = (selectedCard: IProjectCard, howToPay: HowToPay) => {
        const cardCost: number = this.getCardCost(game, selectedCard);
        let totalToPay: number = 0;

        const canUseSteel: boolean = this.canUseSteel(selectedCard);
        const canUseTitanium: boolean = this.canUseTitanium(selectedCard);
        
        if (canUseSteel && howToPay.steel > 0) {
          if (howToPay.steel > this.steel) {
            throw new Error("Do not have enough steel");
          }
          totalToPay += howToPay.steel * this.steelValue;
        } 
        
        if (canUseTitanium && howToPay.titanium > 0) {
          if (howToPay.titanium > this.titanium) {
            throw new Error("Do not have enough titanium");
          }
          totalToPay += howToPay.titanium * this.titaniumValue;
        }

        if (this.canUseHeatAsMegaCredits && howToPay.heat !== undefined) {
          totalToPay += howToPay.heat;
        }

        if (howToPay.microbes !== undefined) {
          totalToPay += howToPay.microbes * 2;
        }

        if (howToPay.floaters !== undefined) {
          totalToPay += howToPay.floaters * 3;
        }

        if (howToPay.megaCredits > this.megaCredits) {
          throw new Error("Do not have enough mega credits");
        }

        totalToPay += howToPay.megaCredits;

        if (totalToPay < cardCost) {
          throw new Error("Did not spend enough to pay for card");
        }
        return this.playCard(game, selectedCard, howToPay);
      };

      return new SelectHowToPayForCard(this.getPlayableCards(game), this.getMicrobesCanSpend(), this.getFloatersCanSpend(), this.canUseHeatAsMegaCredits, cb);
    }

    public getMicrobesCanSpend(): number {
        for (const playedCard of this.playedCards) {
            if (playedCard.name === CardName.PSYCHROPHILES) {
                return this.getResourcesOnCard(playedCard);
            }
        }
        return 0;
    }

    public getFloatersCanSpend(): number {
      for (const playedCard of this.playedCards) {

          if (playedCard.name === CardName.DIRIGIBLES) {
              return this.getResourcesOnCard(playedCard);
          }
      }
      return 0;
    }    

    public playCard(game: Game, selectedCard: IProjectCard, howToPay?: HowToPay): undefined { 

        //Activate some colonies
        if (game.coloniesExtension && selectedCard.resourceType !== undefined) {
          game.colonies.filter(colony => colony.resourceType !== undefined && colony.resourceType === selectedCard.resourceType).forEach(colony => {
            colony.isActive = true;
          });
        }

        // Play the card
        const action = selectedCard.play(this, game);
        if (action !== undefined) {
            game.interrupts.push({
                player: this,
                playerInput: action
            });
        }

        const projectCardIndex = this.cardsInHand.findIndex((card) => card.name === selectedCard.name);
        const preludeCardIndex = this.preludeCardsInHand.findIndex((card) => card.name === selectedCard.name);
        if (projectCardIndex !== -1) {
          this.cardsInHand.splice(projectCardIndex, 1);
        } else if (preludeCardIndex !== -1) {
          this.preludeCardsInHand.splice(preludeCardIndex, 1);
        }
        this.addPlayedCard(game, selectedCard);

        if (howToPay !== undefined) {
            this.steel -= howToPay.steel;
            this.titanium -= howToPay.titanium;
            this.megaCredits -= howToPay.megaCredits;
            this.heat -= howToPay.heat;
            for (const playedCard of this.playedCards) {
                if (playedCard.name === CardName.PSYCHROPHILES) {
                    this.removeResourceFrom(playedCard, howToPay.microbes);
                }

                if (playedCard.name === CardName.DIRIGIBLES) {
                    this.removeResourceFrom(playedCard, howToPay.floaters);
                } 
            }
          }

          for (const playedCard of this.playedCards) {
            if (playedCard.onCardPlayed !== undefined) {
              const actionFromPlayedCard: OrOptions | void =
                            playedCard.onCardPlayed(this, game, selectedCard);
              if (actionFromPlayedCard !== undefined) {
                game.interrupts.push({
                    player: this,
                    playerInput: actionFromPlayedCard
                });
              }
            }
          }

          for (let somePlayer of game.getPlayers()) {
            if (somePlayer.corporationCard !== undefined &&
                somePlayer.corporationCard.onCardPlayed !== undefined
            ) {
              const actionFromPlayedCard: OrOptions | void = somePlayer.corporationCard.onCardPlayed(this, game, selectedCard);
              if (actionFromPlayedCard !== undefined) {
                game.interrupts.push({
                    player: this,
                    playerInput: actionFromPlayedCard
                });
              }
            }
          }

        if (selectedCard.name === CardName.ECOLOGY_EXPERTS || selectedCard.name === CardName.ECCENTRIC_SPONSOR) {
            if (this.getPlayableCards(game).length > 0) {
                game.interrupts.push({
                    player: this,
                    playerInput: this.playProjectCard(game)
                });
            }
        }
        return undefined;
    }

    private playActionCard(game: Game): PlayerInput {
      return new SelectCard(
          "Perform an action from a played card",
          this.getPlayableActionCards(game),
          (foundCards: Array<ICard>) => {
            const foundCard = foundCards[0];
            const action = foundCard.action!(this, game);
            if (action !== undefined) {
                game.interrupts.push({
                    player: this,
                    playerInput: action
                });
            }
            this.actionsThisGeneration.add(foundCard.name);
            game.log(
              LogMessageType.DEFAULT,
              "${0} used ${1} action",
              new LogMessageData(LogMessageDataType.PLAYER, this.name),
              new LogMessageData(LogMessageDataType.CARD, foundCard.name)
            );
            return undefined;
          }
      );
    }

  private onStandardProject(projectType: StandardProjectType): void {
    if (this.corporationCard !== undefined && this.corporationCard.onStandardProject!== undefined) {
      this.corporationCard.onStandardProject(this, projectType);
    }

    for (const playedCard of this.playedCards) {
      if (playedCard.onStandardProject !== undefined) {
        playedCard.onStandardProject(this, projectType);
      }
    }
  }

  private sellPatents(game: Game): PlayerInput {
      return new SelectCard(
          "Sell patents",
          this.cardsInHand,
          (foundCards: Array<IProjectCard>) => {

            this.onStandardProject(StandardProjectType.SELLING_PATENTS);
            this.megaCredits += foundCards.length;
            foundCards.forEach((card) => {
              for (let i = 0; i < this.cardsInHand.length; i++) {
                if (this.cardsInHand[i].name === card.name) {
                  this.cardsInHand.splice(i, 1);
                  break;
                }
              }
              game.dealer.discard(card);
            });
            game.log(
              LogMessageType.DEFAULT,
              "${0} used sell patents standard project",
              new LogMessageData(LogMessageDataType.PLAYER, this.name)
            );
            return undefined;
          }, this.cardsInHand.length
      );
    }

    private buildColony(game: Game, openColonies: Array<IColony>): PlayerInput {
      let buildColony = new OrOptions();
      buildColony.title = "Build colony (" + constants.BUILD_COLONY_COST + " MC)";
      openColonies.forEach(colony => {
        const colonySelect =  new SelectOption(
          colony.name + " - (" + colony.description + ")", 
          () => {
            game.addSelectHowToPayInterrupt(this, constants.BUILD_COLONY_COST, false, false, "Select how to pay for Colony project");
            colony.onColonyPlaced(this, game);
            this.onStandardProject(StandardProjectType.BUILD_COLONY);
            game.log(
              LogMessageType.DEFAULT,
              "${0} built a colony on ${1}",
              new LogMessageData(LogMessageDataType.PLAYER, this.name),
              new LogMessageData(LogMessageDataType.COLONY, colony.name)
            );
            return undefined;
          }
        );
        buildColony.options.push(colonySelect);
      }); 
      return buildColony;
    }      

    private airScraping(game: Game): PlayerInput {
      return new SelectOption(
        "Air scraping (" + constants.AIR_SCRAPING_COST + " MC)", 
        () => {
          game.addSelectHowToPayInterrupt(this, constants.AIR_SCRAPING_COST, false, false, "Select how to pay for Air Scrapping project");
          game.increaseVenusScaleLevel(this, 1);
          this.onStandardProject(StandardProjectType.AIR_SCRAPING);
          game.log(
            LogMessageType.DEFAULT,
            "${0} used Air Scrapping standard project",
            new LogMessageData(LogMessageDataType.PLAYER, this.name)
          );
          return undefined;
        }
      );
    }

    private buildPowerPlant(game: Game): PlayerInput {
      return new SelectOption(
        "Power plant (" + this.powerPlantCost + " MC)", 
        () => {
          game.addSelectHowToPayInterrupt(this, this.powerPlantCost, false, false, "Select how to pay for Power Plant project");
          this.energyProduction++;
          this.onStandardProject(StandardProjectType.POWER_PLANT);
          game.log(
            LogMessageType.DEFAULT,
            "${0} used power plant standard project",
            new LogMessageData(LogMessageDataType.PLAYER, this.name)
          );
          return undefined;
        }
      );
    }

    private asteroid(game: Game): PlayerInput {
      return new SelectOption(
        "Asteroid (" + constants.ASTEROID_COST + " MC)", 
        () => {
          game.addSelectHowToPayInterrupt(this, constants.ASTEROID_COST, false, false, "Select how to pay for Asteroid project");
          game.increaseTemperature(this, 1);
          this.onStandardProject(StandardProjectType.ASTEROID);
          game.log(
            LogMessageType.DEFAULT,
            "${0} used asteroid standard project",
            new LogMessageData(LogMessageDataType.PLAYER, this.name)
          );
          return undefined;
        }
      );
    }  

    private aquifer(game: Game): PlayerInput {
      return new SelectOption(
        "Aquifer (" + constants.AQUIFER_COST + " MC)", 
        () => {
          game.addSelectHowToPayInterrupt(this, constants.AQUIFER_COST, false, false, "Select how to pay for Aquifer project");
          game.addOceanInterrupt(this, "Select space for ocean");
          this.onStandardProject(StandardProjectType.AQUIFER);
          game.log(
            LogMessageType.DEFAULT,
            "${0} used aquafier standard project",
            new LogMessageData(LogMessageDataType.PLAYER, this.name)
          );
          return undefined;
        }
      );
    } 

    private addGreenery(game: Game): PlayerInput {
      return new SelectOption(
        "Greenery (" + constants.GREENERY_COST + " MC)", 
        () => {
          game.addSelectHowToPayInterrupt(this, constants.GREENERY_COST, false, false, "Select how to pay for Greenery project");
          game.addInterrupt(new SelectGreenery(this, game));
          this.onStandardProject(StandardProjectType.GREENERY);
          game.log(
            LogMessageType.DEFAULT,
            "${0} used greenery standard project",
            new LogMessageData(LogMessageDataType.PLAYER, this.name)
          );
          return undefined;
        }
      );
    } 

    private addCity(game: Game): PlayerInput {
      return new SelectOption(
        "City (" + constants.CITY_COST + " MC)", 
        () => {
          game.addSelectHowToPayInterrupt(this, constants.CITY_COST, false, false, "Select how to pay for City project");
          game.addInterrupt(new SelectCity(this, game));
          this.onStandardProject(StandardProjectType.CITY);
          this.setProduction(Resources.MEGACREDITS);
          game.log(
            LogMessageType.DEFAULT,
            "${0} used city standard project",
            new LogMessageData(LogMessageDataType.PLAYER, this.name)
          );
          return undefined;
        }
      );
    } 

    private tradeWithColony(openColonies: Array<IColony>, game: Game): PlayerInput {
      let selectColony = new OrOptions();
      openColonies.forEach(colony => {
        const colonySelect =  new SelectOption(
          colony.name + " - (" + colony.description + ")", 
          () => {
            colony.trade(this, game);
            game.log(
              LogMessageType.DEFAULT,
              "${0} traded with ${1}",
              new LogMessageData(LogMessageDataType.PLAYER, this.name),
              new LogMessageData(LogMessageDataType.PLAYER, colony.name)
            );
            return undefined;
          }
        );
        selectColony.options.push(colonySelect);
      });      
      let howToPayForTrade = new OrOptions();
      howToPayForTrade.title = "Trade with a colony";
      const payWithMC = new SelectOption("Pay " + (9 - this.colonyTradeDiscount) +" MC", () => {
        this.megaCredits -= (9 - this.colonyTradeDiscount);
        return selectColony;
      });

      if (this.canAfford(9) && this.canUseHeatAsMegaCredits && this.heat > 0) {
        let htp: HowToPay;
        let helionTrade = new SelectHowToPay(
          "Select how to spend " + (9 - this.colonyTradeDiscount) +" MC",
          false,
          false,
          true,
          (9 - this.colonyTradeDiscount),
          (stp) => {
            htp = stp;
            this.megaCredits -= htp.megaCredits;
            this.heat -= htp.heat;
            return selectColony;
          }
        )
        howToPayForTrade.options.push(helionTrade);

      } else if (this.canAfford((9 - this.colonyTradeDiscount))) {
        howToPayForTrade.options.push(payWithMC);
      }

      const payWithEnergy = new SelectOption("Pay " + (3 - this.colonyTradeDiscount) +" Energy", () => {
        this.energy -= (3 - this.colonyTradeDiscount);
        return selectColony;
      });  
      const payWithTitanium = new SelectOption("Pay " + (3 - this.colonyTradeDiscount) +" Titanium", () => {
        this.titanium -= (3 - this.colonyTradeDiscount);
        return selectColony;  
      });

      if (this.energy >= (3 - this.colonyTradeDiscount)) howToPayForTrade.options.push(payWithEnergy);
      if (this.titanium >= (3 - this.colonyTradeDiscount)) howToPayForTrade.options.push(payWithTitanium);

      return howToPayForTrade;
    }

    private convertPlantsIntoGreenery(game: Game): PlayerInput {
      return new SelectSpace(
          `Convert ${this.plantsNeededForGreenery} plants into greenery`,
          game.board.getAvailableSpacesForGreenery(this),
          (space: ISpace) => {
            game.addGreenery(this, space.id);
            this.plants -= this.plantsNeededForGreenery;
            game.log(
              LogMessageType.DEFAULT,
              "${0} converted plants into a greenery",
              new LogMessageData(LogMessageDataType.PLAYER, this.name),
            );
            return undefined;
          }
      );
    }

    private convertHeatIntoTemperature(game: Game): PlayerInput {
      let heatAmount: number;
      let floaterAmount: number;
      if (this.isCorporation(CardName.STORMCRAFT_INCORPORATED) && this.getResourcesOnCorporation() > 0 ) {
        let raiseTempOptions = new AndOptions (
          () => {
            if (heatAmount + (floaterAmount * 2) < 8) {
                throw new Error("Need to pay 8 heat");
            }
            this.removeResourceFrom(this.corporationCard as ICard, floaterAmount);
            this.heat -= heatAmount;
            game.increaseTemperature(this, 1);
            game.log(
              LogMessageType.DEFAULT,
              "${0} converted heat into temperature",
              new LogMessageData(LogMessageDataType.PLAYER, this.name)
            );
            return undefined;
          },
          new SelectAmount("Select amount of heat to spend", (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, this.heat),
          new SelectAmount("Select amount of floater on corporation to spend", (amount: number) => {
            floaterAmount = amount;
            return undefined;
          }, this.getResourcesOnCorporation())
        );
        raiseTempOptions.title = "Select resource amounts to raise temp";

        return new SelectOption("Convert 8 heat into temperature", () => {
          return raiseTempOptions;
        });

      } else {

      return new SelectOption("Convert 8 heat into temperature", () => {
        game.increaseTemperature(this, 1);
        this.heat -= 8;
        game.log(
          LogMessageType.DEFAULT,
          "${0} converted heat into temperature",
          new LogMessageData(LogMessageDataType.PLAYER, this.name)
        );
        return undefined;
      });
    }
    }

    private claimMilestone(
        milestone: IMilestone,
        game: Game): SelectHowToPay | SelectOption {
      const claimer = (megaCredits: number, heat: number) => {
        game.claimedMilestones.push({
          player: this,
          milestone: milestone
        });
        this.heat -= heat;
        this.megaCredits -= megaCredits;
        game.log(
          LogMessageType.DEFAULT,
          "${0} claimed ${1} milestone",
          new LogMessageData(LogMessageDataType.PLAYER, this.name),
          new LogMessageData(LogMessageDataType.MILESTONE, milestone.name)
        );
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            "Claim milestone: " + milestone.name,
            false,
            false,
            true,
            8,
            (stp) => {
              if (stp.megaCredits + stp.heat < 8) {
                throw new Error(
                    "Did not spend enough to claim milestone"
                );
              }
              return claimer(stp.megaCredits, stp.heat);
            }
        );
      }
      return new SelectOption(milestone.name, () => {
        return claimer(8, 0);
      });
    }

    private fundAward(award: IAward, game: Game): PlayerInput {
      const funder = (megaCredits: number, heat: number) => {
        game.fundAward(this, award);
        this.megaCredits -= megaCredits;
        this.heat -= heat;
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            award.name + " (" + game.getAwardFundingCost() + " MC)",
            false,
            false,
            true,
            game.getAwardFundingCost(),
            (htp: HowToPay) => {
              return funder(htp.megaCredits, htp.heat);
            }
        );
      }
      return new SelectOption(award.name, () => {
        return funder(game.getAwardFundingCost(), 0);
      });
    }

    private giveAwards(game: Game): void {

      game.fundedAwards.forEach((fundedAward) => {

        // Awards are disabled for 1 player games
        if (game.getPlayers().length === 1) return;

        const players: Array<Player> = game.getPlayers().slice();
        players.sort(
            (p1, p2) => fundedAward.award.getScore(p2, game) - fundedAward.award.getScore(p1, game)
        );

        // We have one rank 1 player
        if (fundedAward.award.getScore(players[0], game) > fundedAward.award.getScore(players[1], game)) {

          if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints("awards", 5, "1st place for "+fundedAward.award.name+" award (funded by "+fundedAward.player.name+")");
          players.shift();

          if (players.length > 1) {

            // We have one rank 2 player
            if (fundedAward.award.getScore(players[0], game) > fundedAward.award.getScore(players[1], game)) {

              if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints("awards", 2, "2nd place for "+fundedAward.award.name+" award (funded by "+fundedAward.player.name+")");

            // We have at least two rank 2 players
            } else {

              const score = fundedAward.award.getScore(players[0], game);
              while (players.length > 0 && fundedAward.award.getScore(players[0], game) === score) {
                if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints("awards", 2, "2nd place for "+fundedAward.award.name+" award (funded by "+fundedAward.player.name+")");
                players.shift();

              }
            }
          }

        // We have at least two rank 1 players
        } else {

          const score = fundedAward.award.getScore(players[0], game);
          while (players.length > 0 && fundedAward.award.getScore(players[0], game) === score) {
            if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints("awards", 5, "1st place for "+fundedAward.award.name+" award (funded by "+fundedAward.player.name+")");
            players.shift();
          }

        }
      });

    }

    private endTurnOption(game: Game): PlayerInput {
      return new SelectOption("End Turn", () => {
        this.actionsTakenThisRound = 1;
        game.log(
          LogMessageType.DEFAULT,
          "${0} ended turn",
          new LogMessageData(LogMessageDataType.PLAYER, this.name)
        );
        return undefined;
      });
    }

    private passOption(game: Game): PlayerInput {
      return new SelectOption("Pass", () => {
        game.playerHasPassed(this);
        game.log(
          LogMessageType.DEFAULT,
          "${0} passed",
          new LogMessageData(LogMessageDataType.PLAYER, this.name)
        );
        this.lastCardPlayed = undefined;
        return undefined;
      });
    }

    // Propose a new action to undo last action
    private undoTurnOption(game: Game): PlayerInput {
      return new SelectOption("Undo Turn", () => {
        try {
          Database.getInstance().restoreLastSave(game.id, game.lastSaveId, game);
        }
        catch(error){
          console.log(error);
        }
        return undefined;
      });
    }

    public takeActionForFinalGreenery(game: Game): void {
      if (game.canPlaceGreenery(this)) {
        const action: OrOptions = new OrOptions();
        action.title = "Place any final greenery from plants";
        action.options.push(
            new SelectOption("Don't place a greenery", () => {
              game.playerIsDoneWithGame(this);
              return undefined;
            })
        );
        action.options.push(
            new SelectSpace(
                "Select space for greenery",
                game.board.getAvailableSpacesForGreenery(this), (space) => {
                  game.addGreenery(this, space.id);
                  this.plants -= this.plantsNeededForGreenery;
                  this.takeActionForFinalGreenery(game);
                  return undefined;
                }
            )
        );
        this.setWaitingFor(action, () => {});
        return;
      }
      game.playerIsDoneWithGame(this);
    }

    private getPlayableCards(game: Game): Array<IProjectCard> {
      return this.cardsInHand.filter((card) => {
        const canUseSteel = card.tags.indexOf(Tags.STEEL) !== -1;
        const canUseTitanium = card.tags.indexOf(Tags.SPACE) !== -1;
        let maxPay = 0;
        if (this.canUseHeatAsMegaCredits) {
          maxPay += this.heat;
        }
        if (canUseSteel) {
          maxPay += this.steel * this.steelValue;
        }
        if (canUseTitanium) {
          maxPay += this.titanium * this.titaniumValue;
        }

        let psychrophiles = this.playedCards.find(
          (playedCard) => playedCard.name === CardName.PSYCHROPHILES);

        if (psychrophiles !== undefined 
           && psychrophiles.resourceCount
           && card.tags.indexOf(Tags.PLANT) !== -1) {
            maxPay += psychrophiles.resourceCount * 2;
        }

        let dirigibles = this.playedCards.find(
          (playedCard) => playedCard.name === CardName.DIRIGIBLES);

        if (dirigibles !== undefined 
           && dirigibles.resourceCount
           && card.tags.indexOf(Tags.VENUS) !== -1) {
            maxPay += dirigibles.resourceCount * 3;
        }

        maxPay += this.megaCredits;
        return maxPay >= this.getCardCost(game, card) &&
                   (card.canPlay === undefined || card.canPlay(this, game));
      });
    }

    public canAfford(cost: number, canUseSteel: boolean = false, canUseTitanium: boolean = false): boolean {
      return (this.canUseHeatAsMegaCredits ? this.heat : 0) +
              (canUseSteel ? this.steel * this.steelValue : 0) +
              (canUseTitanium ? this.titanium * this.titaniumValue : 0) +
                this.megaCredits >= cost;
    }

    private getAvailableStandardProjects(game: Game): OrOptions {
      const standardProjects = new OrOptions();
      standardProjects.title = "Pay for a standard project";

      if (this.canAfford(this.powerPlantCost)) {
        standardProjects.options.push(
            this.buildPowerPlant(game)
        );
      }

      if (
        this.canAfford(constants.ASTEROID_COST) &&
            game.getTemperature() < constants.MAX_TEMPERATURE) {
        standardProjects.options.push(
            this.asteroid(game)
        );
      }

      if (
        this.canAfford(constants.AQUIFER_COST) &&
            game.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
        standardProjects.options.push(
            this.aquifer(game)
        );
      }

      if (
        this.canAfford(constants.GREENERY_COST) &&
            game.board.getAvailableSpacesForGreenery(this).length > 0) {
        standardProjects.options.push(
            this.addGreenery(game)
        );
      }

      if (
        this.canAfford(constants.CITY_COST) &&
            game.board.getAvailableSpacesForCity(this).length > 0) {
        standardProjects.options.push(
            this.addCity(game)
        );
      }

      if ( game.venusNextExtension &&
        this.canAfford(constants.AIR_SCRAPING_COST) &&
            game.getVenusScaleLevel() < constants.MAX_VENUS_SCALE) {
        standardProjects.options.push(
            this.airScraping(game)
        );
      }

      if ( game.coloniesExtension &&
        this.canAfford(constants.BUILD_COLONY_COST)) {
        let openColonies = game.colonies.filter(colony => colony.colonies.length < 3 
          && colony.colonies.indexOf(this) === -1
          && colony.isActive);      
          if (openColonies.length > 0) {
            standardProjects.options.push(
                this.buildColony(game, openColonies)
            );
          }
      }

      return standardProjects;
    }

    public takeAction(game: Game): void {

      //Interrupt action
      const interruptIndex = game.interrupts.findIndex(interrupt => interrupt.player === this);
      if (interruptIndex !== -1) {
          this.setWaitingFor(game.interrupts.splice(interruptIndex, 1)[0].playerInput, () => {
            this.takeAction(game);
          });
          return;
      }
 
      // Prelude cards have to be played first
      if (this.preludeCardsInHand.length > 0) {
        this.setWaitingFor(this.playPreludeCard(game), () => {
            if (this.preludeCardsInHand.length === 1) {
                this.takeAction(game);
            } else {
                game.playerIsFinishedTakingActions();
            }
        });
        return;
      }

      if (
        game.getGeneration() === 1 &&
            this.corporationCard !== undefined &&
            this.corporationCard.initialAction !== undefined &&
            !this.actionsThisGeneration.has("CORPORATION_INITIAL_ACTION") &&
            this.actionsTakenThisRound === 0
      ) {
        const input = this.corporationCard.initialAction(this, game);
        if (input !== undefined) {
          game.interrupts.push({
            player: this,
            playerInput: input
          });
        }
        this.actionsThisGeneration.add("CORPORATION_INITIAL_ACTION");
        this.actionsTakenThisRound++;
        this.takeAction(game);
        return;
      }

      if (game.hasPassedThisActionPhase(this) || this.actionsTakenThisRound >= 2) {
        this.actionsTakenThisRound = 0;
        game.playerIsFinishedTakingActions();
        return;
      }         

      const action: OrOptions = new OrOptions();
      action.title = "Take action for action phase, select one " +
                       "available action.";

      if (this.getPlayableCards(game).length > 0) {
        action.options.push(
            this.playProjectCard(game)
        );
      }

      if (this.getPlayableActionCards(game).length > 0) {
        action.options.push(
            this.playActionCard(game)
        );
      }

      action.options.push(
          this.passOption(game)
      );

      if (this.cardsInHand.length > 0) {
        action.options.push(
            this.sellPatents(game)
        );
      }

      if (game.getPlayers().length > 1 && this.actionsTakenThisRound > 0) {
        action.options.push(
            this.endTurnOption(game)
        );
      }

      if (game.coloniesExtension) {
        let openColonies = game.colonies.filter(colony => colony.isActive && colony.visitor === undefined);
        if (openColonies.length > 0 
          && this.fleetSize > this.tradesThisTurn
          && (this.canAfford(9 - this.colonyTradeDiscount) 
            || this.energy >= (3 - this.colonyTradeDiscount) 
            || this.titanium >= (3 - this.colonyTradeDiscount)) 
          ) {
          action.options.push(
            this.tradeWithColony(openColonies, game)
          );
        }
      }

      const standardProjects = this.getAvailableStandardProjects(game);

      if (standardProjects.options.length > 1) {
        action.options.push(standardProjects);
      } else if (standardProjects.options.length === 1) {
        action.options.push(standardProjects.options[0]);
      }

      if (
        this.plants >= this.plantsNeededForGreenery &&
            game.board.getAvailableSpacesForGreenery(this).length > 0) {
        action.options.push(
            this.convertPlantsIntoGreenery(game)
        );
      }

      if (
        (this.heat >= constants.HEAT_FOR_TEMPERATURE || 
          (this.isCorporation(CardName.STORMCRAFT_INCORPORATED) &&
           (this.getResourcesOnCorporation() * 2) + this.heat >= constants.HEAT_FOR_TEMPERATURE)
           ) &&
            game.getTemperature() + 2 <= constants.MAX_TEMPERATURE) {
        action.options.push(
            this.convertHeatIntoTemperature(game)
        );
      }

      if (this.canAfford(8) && !game.allMilestonesClaimed()) {
        const remainingMilestones = new OrOptions();
        remainingMilestones.title = "Select a milestone to claim";
        remainingMilestones.options = game.milestones
            .filter(
                (milestone: IMilestone) =>
                  !game.milestoneClaimed(milestone) &&
                        milestone.canClaim(this, game))
            .map(
                (milestone: IMilestone) =>
                  this.claimMilestone(milestone, game));
        if (remainingMilestones.options.length > 1) {
          action.options.push(remainingMilestones);
        } else if (remainingMilestones.options.length === 1) {
          action.options.push(remainingMilestones.options[0]);
        }
      }

      if (
        this.canAfford(game.getAwardFundingCost()) &&
            !game.allAwardsFunded()) {
        const remainingAwards = new OrOptions();
        remainingAwards.title = "Select an award to fund";
        remainingAwards.options = game.awards
            .filter((award: IAward) => game.hasBeenFunded(award) === false)
            .map((award: IAward) => this.fundAward(award, game));
        action.options.push(remainingAwards);
      }

      // Propose undo action only if you have done one action this turn
      if (this.actionsTakenThisRound > 0) {
        action.options.push(this.undoTurnOption(game));
      }

      action.options.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        } else if (a.title < b.title) {
          return -1;
        }
        return 0;
      });

      this.setWaitingFor(action, () => {
        this.actionsTakenThisRound++;
        this.takeAction(game);
      });

    }

    public process(game: Game, input: Array<Array<string>>): void {
      if (this.waitingFor === undefined || this.waitingForCb === undefined) {
        throw new Error("Not waiting for anything");
      }
      const waitingFor = this.waitingFor;
      const waitingForCb = this.waitingForCb;
      this.waitingFor = undefined;
      this.waitingForCb = undefined;
      try {
        this.runInput(game, input, waitingFor);
        waitingForCb();
      } catch (err) {
        this.waitingFor = waitingFor;
        this.waitingForCb = waitingForCb;
        throw err;
      }
    }

    public getWaitingFor(): PlayerInput | undefined {
      return this.waitingFor;
    }

    public setWaitingFor(input: PlayerInput, cb: () => void): void {
      this.waitingFor = input;
      this.waitingForCb = cb;
    }

    // Function used to rebuild each objects
    public loadFromJSON(d: SerializedPlayer): Player {
      // Assign each attributes
      let o = Object.assign(this, d);

      // Rebuild generation played map
      this.generationPlayed = new Map<string, number>(d.generationPlayed);

      // action this generation set
      this.actionsThisGeneration = new Set<string>(d.actionsThisGeneration);

      // Rebuild corporation card
      if (d.corporationCard !== undefined) {
        this.corporationCard = getCorporationCardByName(d.corporationCard.name);
        if(d.corporationCard.resourceCount && d.corporationCard.resourceCount > 0) {
          this.corporationCard!.resourceCount = d.corporationCard.resourceCount;
        }
      } else {
          this.corporationCard = undefined;
      }

      // Rebuild deal corporation array
      this.dealtCorporationCards = d.dealtCorporationCards.map((element: CorporationCard)  => {
        return getCorporationCardByName(element.name)!;
      });

      // Rebuild each cards in hand
      this.cardsInHand = d.cardsInHand.map((element: IProjectCard)  => {
        return getProjectCardByName(element.name)!;
      });

      // Rebuild each prelude in hand
      this.preludeCardsInHand = d.preludeCardsInHand.map((element: IProjectCard)  => {
        return getProjectCardByName(element.name)!;
      });

      // Rebuild each played card
      this.playedCards = d.playedCards.map((element: IProjectCard)  => {
        let card = getProjectCardByName(element.name)!;
        if(element.resourceCount && element.resourceCount > 0) {
          card.resourceCount = element.resourceCount;
        }
        return card;
      });

      // Rebuild each drafted cards
      this.draftedCards = d.draftedCards.map((element: IProjectCard)  => {
        return getProjectCardByName(element.name)!;
      });
      
      return o;
    }
}

