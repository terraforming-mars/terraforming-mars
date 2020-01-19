import {IProjectCard} from './cards/IProjectCard';
import { CorporationCard } from './cards/corporation/CorporationCard';
import {Tags} from './cards/Tags';
import {PlayerInput} from './PlayerInput';
import {CardType} from './cards/CardType';
import {Color} from './Color';
import {SelectCard} from './inputs/SelectCard';
import {AndOptions} from './inputs/AndOptions';
import {ICard} from './cards/ICard';
import {OrOptions} from './inputs/OrOptions';
import {Game} from './Game';
import {HowToPay} from './inputs/HowToPay';
import {SelectSpace} from './inputs/SelectSpace';
import {ISpace} from './ISpace';
import {SelectHowToPayForCard} from './inputs/SelectHowToPayForCard';
import {SelectHowToPay} from './inputs/SelectHowToPay';
import {SelectAmount} from './inputs/SelectAmount';
import {SelectOption} from './inputs/SelectOption';
import {SelectPlayer} from './inputs/SelectPlayer';
import {IMilestone} from './milestones/IMilestone';
import {StandardProjectType} from './StandardProjectType';
import * as constants from './constants';
import {IAward} from './awards/IAward';
import { VictoryPointsBreakdown } from './VictoryPointsBreakdown';
import {Resources} from './Resources';
import { ResourceType } from './ResourceType';
import { Celestic } from './cards/venusNext/Celestic';
import { CardName } from "./CardName";
import { CorporationName } from './CorporationName';


const INITIAL_ACTION: string = 'INITIAL';

export class Player {
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
    public generationPlayed: Map<string, number> = new Map<string, number>();
    public actionsTakenThisRound: number = 0;
    public terraformRating: number = 20;
    public terraformRatingAtGenerationStart: number = 20;
    public resourcesOnCards: Map<string, number> = new Map<string, number>();
    public victoryPoints: number = 0;
    public victoryPointsBreakdown = new VictoryPointsBreakdown();
    private actionsThisGeneration: Set<string> = new Set<string>();
    private lastCardPlayedThisTurn: IProjectCard | undefined;
    private waitingFor?: PlayerInput;
    private postAction: Boolean = false;
    public cardCost: number = constants.CARD_COST;
    public oceanBonus: number = constants.OCEAN_BONUS;

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
      return 0;
    }

    public setProduction(resource: Resources, amount : number = 1, game? : Game, fromPlayer? : Player) {

      if (resource === Resources.MEGACREDITS) this.megaCreditProduction = Math.max(-5, this.megaCreditProduction + amount);
      if (resource === Resources.STEEL) this.steelProduction = Math.max(0, this.steelProduction + amount);
      if (resource === Resources.TITANIUM) this.titaniumProduction = Math.max(0, this.titaniumProduction + amount);
      if (resource === Resources.PLANTS) this.plantProduction = Math.max(0, this.plantProduction + amount);
      if (resource === Resources.ENERGY) this.energyProduction = Math.max(0, this.energyProduction + amount);
      if (resource === Resources.HEAT) this.heatProduction = Math.max(0, this.heatProduction + amount);
      
      if (game !== undefined && fromPlayer !== undefined && amount < 0) {
        game.log(this.name + "'s " + resource + " production modified by " + amount + " by " + fromPlayer.name);
      }

      //Manutech hook
      if (amount > 0 && this.corporationCard !== undefined && this.corporationCard.name ===  CorporationName.MANUTECH) {
        if (resource === Resources.MEGACREDITS) this.megaCredits += amount;
        if (resource === Resources.STEEL) this.steel += amount;
        if (resource === Resources.TITANIUM) this.titanium += amount;
        if (resource === Resources.PLANTS) this.plants += amount;
        if (resource === Resources.ENERGY) this.energy += amount;
        if (resource === Resources.HEAT) this.heat += amount;
      }

    };  

    public getActionsThisGeneration(): Set<string> {
      return this.actionsThisGeneration;
    }

    public setActionsThisGeneration(cardName: string): void {
      this.actionsThisGeneration.add(cardName);
      return;
    }

    public getLastCardPlayedThisTurn(): IProjectCard | undefined {
      return this.lastCardPlayedThisTurn;
    }
    public getOtherPlayersWithPlantsToRemove(game: Game): Array<Player> {
      return game.getPlayers().filter((player) => player.id !== this.id && !player.hasProtectedHabitats() && player.plants > 0);
    }

    public cardIsInEffect(cardName: CardName): boolean {
      return this.playedCards.find(
        (playedCard) => playedCard.name === cardName) !== undefined;      
    }

    public hasProtectedHabitats(): boolean {
      return this.cardIsInEffect(CardName.PROTECTED_HABITATS);
    }
    
    public removePlants(removingPlayer: Player, count: number): void {
      if (removingPlayer !== this && this.hasProtectedHabitats()) {
        throw new Error('Can not remove plants due to protected habitats');
      }
      this.plants = Math.max(0, this.plants - count);
    }
    public removeAnimals(
        removingPlayer: Player,
        card: IProjectCard,
        count: number): void {
      if (removingPlayer !== this && this.hasProtectedHabitats()) {
        throw new Error('Can not remove animals due to protected habitats');
      }
      if (card.name === CardName.PETS) {
        throw new Error('Animals may not be removed from pets');
      }
      if (this.getResourcesOnCard(card) === 0) {
        throw new Error(card.name + ' does not have animals to remove');
      }
      this.removeResourceFrom(card, count);
    }
    public removeMicrobes(
        removingPlayer: Player,
        card: IProjectCard,
        count: number): void {
      if (removingPlayer !== this && this.hasProtectedHabitats()) {
        throw new Error(
            'Can not remove microbes due to protected habitats'
        );
      }
      if (this.getResourcesOnCard(card) === 0) {
        throw new Error(card.name + ' does not have microbes to remove');
      }
      this.removeResourceFrom(card, count);
    }

    public getResourcesOnCard(card: ICard): number {
      return this.resourcesOnCards.get(card.name) || 0;
    }

    public getResourcesOnCardname(cardname: CardName):number {
      return this.resourcesOnCards.get(cardname) || 0;
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
    public lastCardPlayedThisGeneration(game: Game): undefined | IProjectCard {
      const lastCardPlayed = this.playedCards[this.playedCards.length - 1];
      if (lastCardPlayed !== undefined) {
        const generationPlayed =
                this.generationPlayed.get(lastCardPlayed.name);
        if (generationPlayed === game.generation) {
          return lastCardPlayed;
        }
      }
      return undefined;
    }
    public addAnimalsToCard(card: IProjectCard, count: number): void {
      this.addResourceTo(card, count);
    }
    private generateId(): string {
      return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
    }
    public removeResourceFrom(card: IProjectCard, count: number = 1): void {
      const cardValue: number | undefined =
            this.resourcesOnCards.get(card.name);
      if (cardValue) {
        this.resourcesOnCards.set(
            card.name, Math.max(cardValue - count, 0)
        );
      }
    }
    public addResourceTo(card: IProjectCard, count: number = 1): void {
      const cardValue: number | undefined =
            this.resourcesOnCards.get(card.name);
      if (cardValue) {
        this.resourcesOnCards.set(card.name, cardValue + count);
      } else {
        this.resourcesOnCards.set(card.name, count);
      }
    }
    public getCardsWithResources(): Array<IProjectCard> {
      return this.playedCards.filter(
          (card) => Number(this.resourcesOnCards.get(card.name)) > 0
      );
    }

    public getResourceCards(resource: ResourceType): Array<IProjectCard> {
      const result: Array<IProjectCard> = [];
        this.playedCards.forEach((card) => {
          if (card.resourceType !== undefined && card.resourceType === resource) {
            result.push(card);
          }
        });
      if (this.isCorporation(CorporationName.CELESTIC) &&  resource === ResourceType.FLOATER) {
        result.push(new Celestic());
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
      if (this.isCorporation(CorporationName.CELESTIC) &&  resource === ResourceType.FLOATER) {
        count += this.getResourcesOnCard(new Celestic());
      }
      return count;

    }

    public getTagCount(tag: Tags, includeEventsTags:boolean = false): number {
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
      } else {
        return tagCount + this.getTagCount(Tags.WILDCARD);
      }
    }
    public getActiveAndAutomatedCards(): Array<IProjectCard> {
      return this.playedCards.filter(
          (pc) => pc.cardType === CardType.AUTOMATED ||
                    pc.cardType === CardType.ACTIVE);
    }
    public getCard(cards: Array<IProjectCard>, cardName: string): IProjectCard {
      const foundCards = cards.filter((card) => card.name === cardName);
      if (foundCards.length === 0) {
        throw new Error('Card not found');
      }
      return foundCards[0];
    }
    private runInput(
        input: Array<Array<string>>,
        pi: PlayerInput): PlayerInput | undefined {
      if (pi instanceof AndOptions) {
        const waiting: AndOptions = pi;
        if (input.length !== waiting.options.length) {
          throw new Error('Not all options provided');
        }
        for (let i = 0; i < input.length; i++) {
          this.runInput([input[i]], waiting.options[i]);
        }
        return pi.cb();
      } else if (pi instanceof SelectAmount) {
        const waiting: SelectAmount = pi;
        if (input.length !== 1) {
          throw new Error('Incorrect options provided');
        }
        if (input[0].length !== 1) {
          throw new Error('Incorrect number of amounts provided');
        }
        const amount: number = parseInt(input[0][0]);
        if (isNaN(amount)) {
          throw new Error('Number not provided for amount');
        }
        if (amount > waiting.max) {
          throw new Error('Amount provided too high');
        }
        if (amount < 0) {
          throw new Error('Amount provided too low');
        }
        return pi.cb(amount);
      } else if (pi instanceof SelectOption) {
        return pi.cb();
      } else if (pi instanceof OrOptions) {
        const waiting: OrOptions = pi;
        const optionIndex = parseInt(input[0][0]);
        const remainingInput = input[0].slice();
        // Remove option index to process option
        remainingInput.shift();
        return this.runInput([remainingInput], waiting.options[optionIndex]);
      } else if (pi instanceof SelectHowToPayForCard) {
        if (input.length !== 1 || input[0].length !== 2) {
          throw new Error('Incorrect options provided');
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
          throw new Error('Unable to parse input ' + err);
        }
        return pi.cb(foundCard, payMethod);
      } else if (pi instanceof SelectCard) {
        if (input.length !== 1) {
          throw new Error('Incorrect options provided');
        }
        const mappedCards: Array<ICard> = [];
        for (const cardName of input[0]) {
          mappedCards.push(this.getCard(pi.cards, cardName));
        }
        if (input[0].length < pi.minCardsToSelect) {
          console.warn('selected cards', input[0]);
          throw new Error('Not enough cards selected');
        }
        if (input[0].length > pi.maxCardsToSelect) {
          console.warn('selected cards', input[0]);
          throw new Error('Too many cards selected');
        }
        if (mappedCards.length !== input[0].length) {
          throw new Error('Not all cards found');
        }
        return pi.cb(mappedCards);
      } else if (pi instanceof SelectAmount) {
        if (input.length !== 1) {
          throw new Error('Incorrect options provided');
        }
        if (input[0].length !== 1) {
          throw new Error('Too many amounts provided');
        }
        if (isNaN(parseInt(input[0][0]))) {
          throw new Error('Amount is not a number');
        }
        return pi.cb(parseInt(input[0][0]));
      } else if (pi instanceof SelectSpace) {
        if (input.length !== 1) {
          throw new Error('Incorrect options provided');
        }
        if (input[0].length !== 1) {
          throw new Error('Too many spaces provided');
        }
        const foundSpace = pi.availableSpaces.find(
            (space) => space.id === input[0][0]
        );
        if (foundSpace === undefined) {
          throw new Error('Space not available');
        }
        return pi.cb(foundSpace);
      } else if (pi instanceof SelectPlayer) {
        if (input.length !== 1) {
          throw new Error('Incorrect options provided');
        }
        if (input[0].length !== 1) {
          throw new Error('Invalid players array provided');
        }
        const foundPlayer = pi.players.find(
            (player) => player.id === input[0][0]
        );
        if (foundPlayer === undefined) {
          throw new Error('Player not available');
        }
        return pi.cb(foundPlayer);
      } else if (pi instanceof SelectHowToPay) {
        if (input.length !== 1) {
          throw new Error('Incorrect options provided');
        }
        if (input[0].length !== 1) {
          throw new Error('Incorrect input provided');
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
            throw new Error('Steel not provided, bad input');
          }
          if (parsedInput.titanium !== undefined) {
            payMethod.titanium = parsedInput.titanium;
          } else {
            throw new Error('Titanium not provided, bad input');
          }
          if (parsedInput.megaCredits !== undefined) {
            payMethod.megaCredits = parsedInput.megaCredits;
          } else {
            throw new Error('Mega credits not provided, bad input');
          }
          if (this.canUseHeatAsMegaCredits) {
            if (parsedInput.heat !== undefined) {
              payMethod.heat = parsedInput.heat;
            } else {
              throw new Error('Heat not provided, bad input');
            }
          }
          if (parsedInput.microbes !== undefined) {
              payMethod.microbes = parsedInput.microbes;
          }
        } catch (err) {
          throw new Error('Unable to parse input ' + err);
        }
        return pi.cb(payMethod);
      } else {
        throw new Error('Unsupported waitingFor');
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
      this.megaCredits += this.megaCreditProduction + this.terraformRating;
      this.heat += this.energy;
      this.heat += this.heatProduction;
      this.energy = this.energyProduction;
      this.titanium += this.titaniumProduction;
      this.steel += this.steelProduction;
      this.plants += this.plantProduction;
    }

    public worldGovernmentTerraforming(game: Game) {
      const action: OrOptions = new OrOptions();
      action.title = 'Select action for World Government Terraforming';
      if (game.getTemperature() < constants.MAX_TEMPERATURE) {
        action.options.push(
          new SelectOption('Increase temperature', () => {
            game.increaseTemperature(this,1);
            game.log(this.name + " acted as World Government and increased temperature");
            game.doneWorldGovernmentTerraforming();
            return undefined;
          })
        );
      }
      if (game.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL) {
        action.options.push(
          new SelectOption('Increase oxygen', () => {
            game.increaseOxygenLevel(this,1);
            game.log(this.name + " acted as World Government and increased oxygen level");
            game.doneWorldGovernmentTerraforming();
            return undefined;
          })
        );
      }
      if (game.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
        action.options.push(
          new SelectSpace(
            'Add an ocean',
            game.board.getAvailableSpacesForOcean(this), (space) => {
              game.addOceanTile(this, space.id);
              game.log(this.name + " acted as World Government and increased oceans");
              game.doneWorldGovernmentTerraforming();
              return undefined;
            }
          )
        );
      }
      if (game.getVenusScaleLevel() < constants.MAX_VENUS_SCALE) {
        action.options.push(
          new SelectOption('Increase Venus scale', () => {
            game.increaseVenusScaleLevel(this,1);
            game.log(this.name + " acted as World Government and increased Venus scale");
            game.doneWorldGovernmentTerraforming();
            return undefined;
          })
        );
      }

      this.setWaitingFor(action);
      return;
  }    

    public runDraftPhase(game: Game, playerName: String, passedCards?: Array<IProjectCard>): void {
      let cards: Array<IProjectCard> = [];
      if (passedCards === undefined) {
        cards.push(
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard()
      ) } else { cards = passedCards}      

      this.setWaitingFor(
        new SelectCard(
          'Select a card to keep and pass the rest to ' + playerName,
          cards,
          (foundCards: Array<IProjectCard>) => {
            this.draftedCards.push(foundCards[0]);
            cards = cards.filter((card) => card !== foundCards[0]);
            game.playerIsFinishedWithDraftingPhase(this,cards);
            return undefined;
          }, 1, 1
        )
      );  
  }  

    public runResearchPhase(game: Game, draftVariant: boolean): void {
      let dealtCards: Array<IProjectCard> = [];
      if (!draftVariant) {
        dealtCards.push(
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard()
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
        game.log(this.name + " bought " + selectedCards.length + " cards");   
        game.playerIsFinishedWithResearchPhase(this);
      };

      if (this.canUseHeatAsMegaCredits) {
        this.setWaitingFor(
            new AndOptions(() => {
              payForCards();
              return undefined;
            },
            new SelectHowToPay(
                'Select how to pay for cards',
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
                'Select which cards to take into hand',
                dealtCards,
                (foundCards: Array<IProjectCard>) => {
                  selectedCards = foundCards;
                  return undefined;
                }, 4, 0
            )
            )
        );
      } else {
        this.setWaitingFor(
            new SelectCard(
                'Select which cards to take into hand',
                dealtCards,
                (foundCards: Array<IProjectCard>) => {
                  htp.megaCredits = foundCards.length * this.cardCost;
                  selectedCards = foundCards;
                  payForCards();
                  return undefined;
                }, 4, 0
            )
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
      game.log(this.name + " played " + card.name);
      this.lastCardPlayedThisTurn = card;
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
            throw new Error('Do not have enough steel');
          }
          totalToPay += howToPay.steel * this.steelValue;
        } 
        
        if (canUseTitanium && howToPay.titanium > 0) {
          if (howToPay.titanium > this.titanium) {
            throw new Error('Do not have enough titanium');
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
          throw new Error('Do not have enough mega credits');
        }

        totalToPay += howToPay.megaCredits;

        if (totalToPay < cardCost) {
          throw new Error('Did not spend enough to pay for card');
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

    public playCard(game: Game, selectedCard: IProjectCard, howToPay?: HowToPay): PlayerInput | undefined { 
      const whenDone = () => {
          var projectCardIndex = this.cardsInHand.findIndex((card) => card.name === selectedCard.name);
          var preludeCardIndex = this.preludeCardsInHand.findIndex((card) => card.name === selectedCard.name);
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

          const actionsFromPlayedCard: OrOptions[] = [];
          for (const playedCard of this.playedCards) {
            if (playedCard.onCardPlayed !== undefined) {
              const actionFromPlayedCard: OrOptions | void =
                            playedCard.onCardPlayed(this, game, selectedCard);
              if (actionFromPlayedCard !== undefined) {
                actionsFromPlayedCard.push(actionFromPlayedCard);
              }
            }
          }

          for (let somePlayer of game.getPlayers()) {
            if (somePlayer.corporationCard !== undefined &&
                somePlayer.corporationCard.onCardPlayed !== undefined
            ) {
              somePlayer.corporationCard.onCardPlayed(somePlayer, game, selectedCard);
            }
          }

          // run through multiple inputs
          if (actionsFromPlayedCard.length > 1) {
            const multipleActions = new AndOptions(() => {
              this.actionsTakenThisRound++;
              this.takeAction(game);
              return undefined;
            });
            multipleActions.options = actionsFromPlayedCard;
            this.setWaitingFor(multipleActions);
            return;
          } else if (actionsFromPlayedCard.length === 1) {
            actionsFromPlayedCard[0].onend = () => {
              this.actionsTakenThisRound++;
              this.takeAction(game);
            };
            this.setWaitingFor(actionsFromPlayedCard[0]);
            return;
          }

          this.actionsTakenThisRound++;
          this.takeAction(game);
        };

        // Play the card
        const action = selectedCard.play(this, game);
        if (action !== undefined) {
          action.onend = whenDone;
          return action;
        }
        whenDone();

        if (selectedCard.postPlay !== undefined && selectedCard.postPlay) {
          this.postAction = true;
        }
        return undefined;
    }

    private playActionCard(game: Game): PlayerInput {
      return new SelectCard(
          'Perform an action from a played card',
          this.getPlayableActionCards(game),
          (foundCards: Array<ICard>) => {
            const foundCard = foundCards[0];
            const action = foundCard.action!(this, game);
            const whenDone = (err?: string) => {
              if (!err) {
                this.actionsThisGeneration.add(foundCard.name);
                this.actionsTakenThisRound++;
              }
              game.log(this.name + " used " + foundCard.name + " action");
              this.takeAction(game);
            };
            if (action !== undefined) {
              action.onend = whenDone;
              return action;
            }
            whenDone();
            return undefined;
          }
      );
    }

    private payForStandardProject(
        projectType: StandardProjectType,
        megaCredits: number,
        heat: number): void {
      this.megaCredits -= megaCredits;
      this.heat -= heat;
      for (const playedCard of this.playedCards) {
        if (playedCard.onStandardProject !== undefined) {
          playedCard.onStandardProject(this, projectType);
        }
      }
    }

    private sellPatents(game: Game): PlayerInput {
      const res = new SelectCard(
          'Sell patents',
          this.cardsInHand,
          (foundCards: Array<IProjectCard>) => {
            this.payForStandardProject(
                StandardProjectType.SELLING_PATENTS, -foundCards.length, 0
            );
            foundCards.forEach((card) => {
              for (let i = 0; i < this.cardsInHand.length; i++) {
                if (this.cardsInHand[i].name === card.name) {
                  this.cardsInHand.splice(i, 1);
                  break;
                }
              }
              game.dealer.discard(card);
            });
            this.actionsTakenThisRound++;
            this.takeAction(game);
            game.log(this.name + " used sell patents standard project");
            return undefined;
          }, this.cardsInHand.length
      );
      res.onend = (err?: string) => {
        if (!err) {
          this.actionsTakenThisRound++;
        }
        this.takeAction(game);
      };
      return res;
    }

    private airScraping(game: Game): PlayerInput {
      const fundProject = (megaCredits: number, heat: number) => {
        game.increaseVenusScaleLevel(this, 1);
        this.payForStandardProject(
            StandardProjectType.AIR_SCRAPING, megaCredits, heat
        );
        this.actionsTakenThisRound++;
        this.takeAction(game);
        game.log(this.name + " used air scraping standard project");
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Air scraping (' + constants.AIR_SCRAPING_COST + ' MC)',
            false, false, true, 
            constants.AIR_SCRAPING_COST,
            (htp) => {
              return fundProject(htp.megaCredits, htp.heat);
            }
        );
      }
      return new SelectOption(
        'Air scraping (' + constants.AIR_SCRAPING_COST + ' MC)', 
        () => {return fundProject(constants.AIR_SCRAPING_COST, 0);}
      );
    }


    private buildPowerPlant(game: Game): PlayerInput {
      const fundProject = (megaCredits: number, heat: number) => {
        this.energyProduction++;
        this.payForStandardProject(
            StandardProjectType.POWER_PLANT, megaCredits, heat
        );
        this.actionsTakenThisRound++;
        this.takeAction(game);
        game.log(this.name + " used power plant standard project");
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Power plant (' + this.powerPlantCost + ' MC)',
            false, false, true, this.powerPlantCost,
            (htp) => {
              return fundProject(htp.megaCredits, htp.heat);
            }
        );
      }
      return new SelectOption(
        'Power plant (' + this.powerPlantCost + ' MC)', 
        () => {return fundProject(this.powerPlantCost, 0);}
      );
    }

    private asteroid(game: Game): PlayerInput {
      const fundProject = (megaCredits: number, heat: number) => {
        const action = game.increaseTemperature(this, 1);
        const whenDone = (err?: string) => {
          if (!err) {
            this.payForStandardProject(
                StandardProjectType.ASTEROID, megaCredits, heat
            );
            this.actionsTakenThisRound++;
          }
          this.takeAction(game);
        };
        if (action !== undefined) {
          action.onend = whenDone;
          return action;
        }
        whenDone();
        game.log(this.name + " used asteroid standard project");
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Asteroid (' + constants.ASTEROID_COST + ' MC)',
            false, false, true, constants.ASTEROID_COST,
            (htp) => {
              if (htp.heat + htp.megaCredits < constants.ASTEROID_COST) {
                throw new Error('Haven\'t spend enough for asteroid');
              }
              return fundProject(htp.megaCredits, htp.heat);
            }
        );
      }
      return new SelectOption(
        'Asteroid (' + constants.ASTEROID_COST + ' MC)', 
        () => {return fundProject(constants.ASTEROID_COST, 0);}
      );
    }

    private aquifer(game: Game): PlayerInput {
      const fundProject = (
          megaCredits: number,
          heat: number,
          spaceId: string) => {
        game.addOceanTile(this, spaceId);
        this.payForStandardProject(
            StandardProjectType.AQUIFER, megaCredits, heat
        );
        this.actionsTakenThisRound++;
        this.takeAction(game);
        game.log(this.name + " used aquifer standard project");
        return undefined;
      };

      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        let htp: HowToPay;
        let helionAquiferProject = new SelectHowToPay(
          'Aquifer (' + constants.AQUIFER_COST + ' MC)', 
          false, false, true, constants.AQUIFER_COST,
          (stp: HowToPay) => {
            if (stp.heat + stp.megaCredits < constants.AQUIFER_COST) {
              throw new Error('Haven\'t spend enough for aquifer');
            }
            htp = stp;
            return new SelectSpace(
              'Select where to place an ocean',
              game.board.getAvailableSpacesForOcean(this),
              (space: ISpace) => {
                return fundProject(htp.megaCredits, htp.heat, space.id);
              }
            )
          }
        );
        return helionAquiferProject;
      }

      return new SelectSpace(
        'Aquifer (' + constants.AQUIFER_COST + ' MC)',
        game.board.getAvailableSpacesForOcean(this),
        (space: ISpace) => {
          return fundProject(constants.AQUIFER_COST, 0, space.id);
        }
      );
    }

    private addGreenery(game: Game): PlayerInput {
      const fundProject = (
          megaCredits: number,
          heat: number,
          spaceId: string) => {
        const action = game.addGreenery(this, spaceId);
        const whenDone = (err?: string) => {
          if (!err) {
            this.payForStandardProject(
                StandardProjectType.GREENERY, megaCredits, heat
            );
            this.actionsTakenThisRound++;
          }
          this.takeAction(game);
        };
        if (action !== undefined) {
          action.onend = whenDone;
          return action;
        }
        whenDone();
        game.log(this.name + " used greenery standard project");
        return undefined;
      };

      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        let htp: HowToPay;

        let helionGreeneryProject = new SelectHowToPay(
            'Greenery (' + constants.GREENERY_COST + ' MC)',
            false, false, true, constants.GREENERY_COST,
            (stp) => {
              htp = stp;
              return new SelectSpace(
                'Select where to place your greenery',
                game.board.getAvailableSpacesForGreenery(this),
                (space: ISpace) => {
                  return fundProject(htp.megaCredits, htp.heat, space.id);
                }
              )
            }
        );
        return helionGreeneryProject;
      }
      return new SelectSpace(
        'Greenery (' + constants.GREENERY_COST + ' MC)',
          game.board.getAvailableSpacesForGreenery(this),
          (space: ISpace) => {
            return fundProject(constants.GREENERY_COST, 0, space.id);
          }
      );
    }

    private addCity(game: Game): PlayerInput {
      const fundProject = (
          megaCredits: number,
          heat: number,
          spaceId: string
      ) => {
        game.addCityTile(this, spaceId);
        this.setProduction(Resources.MEGACREDITS);
        this.payForStandardProject(
            StandardProjectType.CITY,
            megaCredits,
            heat
        );
        this.actionsTakenThisRound++;
        this.takeAction(game);
        game.log(this.name + " used city standard project");
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        let htp: HowToPay;

        let helionCityProject = new SelectHowToPay(
          'City (' + constants.CITY_COST + ' MC)',
          false,
          false,
          true,
          constants.CITY_COST,
          (stp) => {
            htp = stp;
            return new SelectSpace(
              'Select where to place your city',
              game.board.getAvailableSpacesForCity(this),
              (space: ISpace) => {
                return fundProject(htp.megaCredits, htp.heat, space.id);
              }
            )
          }
        )

      return helionCityProject;
      }
      return new SelectSpace(
          'City (' + constants.CITY_COST + ' MC)',
          game.board.getAvailableSpacesForCity(this),
          (space: ISpace) => {
            return fundProject(constants.CITY_COST, 0, space.id);
          }
      );
    }

    private convertPlantsIntoGreenery(game: Game): PlayerInput {
      return new SelectSpace(
          `Convert ${this.plantsNeededForGreenery} plants into greenery`,
          game.board.getAvailableSpacesForGreenery(this),
          (space: ISpace) => {
            const action = game.addGreenery(this, space.id);
            const whenDone = (err?: string) => {
              if (!err) {
                this.plants -= this.plantsNeededForGreenery;
                this.actionsTakenThisRound++;
              }
              this.takeAction(game);
            };
            if (action !== undefined) {
              action.onend = whenDone;
              return action;
            }
            whenDone();
            game.log(this.name + " converted plants into a greenery");
            return undefined;
          }
      );
    }

    private convertHeatIntoTemperature(game: Game): PlayerInput {
      return new SelectOption('Convert 8 heat into temperature', () => {
        const action = game.increaseTemperature(this, 1);
        const whenDone = (err?: string) => {
          if (!err) {
            this.heat -= 8;
            this.actionsTakenThisRound++;
          }
          this.takeAction(game);
        };
        if (action !== undefined) {
          action.onend = whenDone;
          return action;
        }
        whenDone();
        game.log(this.name + " converted heat into temperature");
        return undefined;
      });
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
        this.actionsTakenThisRound++;
        this.takeAction(game);
        game.log(this.name + " claimed " + milestone.name + " milestone");
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Claim milestone: ' + milestone.name,
            false,
            false,
            true,
            8,
            (stp) => {
              if (stp.megaCredits + stp.heat < 8) {
                throw new Error(
                    'Did not spend enough to claim milestone'
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
        this.actionsTakenThisRound++;
        this.takeAction(game);
        game.log(this.name + " funded " + award.name + " award");
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            award.name + ' (' + game.getAwardFundingCost() + ' MC)',
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

    private endTurnOption(game: Game): PlayerInput {
      return new SelectOption('End Turn', () => {
        this.actionsTakenThisRound = 0;
        this.lastCardPlayedThisTurn = undefined;
        game.playerIsFinishedTakingActions(this);
        return undefined;
      });
    }

    private passOption(game: Game): PlayerInput {
      return new SelectOption('Pass', () => {
        game.playerHasPassed(this);
        game.log(this.name + " passed");
        return undefined;
      });
    }

    public takeActionForFinalGreenery(game: Game): void {
      if (game.canPlaceGreenery(this)) {
        const action: OrOptions = new OrOptions();
        action.title = 'Place any final greenery from plants';
        action.options.push(
            new SelectOption('Don\'t place a greenery', () => {
              game.playerIsDoneWithGame(this);
              return undefined;
            })
        );
        action.options.push(
            new SelectSpace(
                'Select space for greenery',
                game.board.getAvailableSpacesForGreenery(this), (space) => {
                  game.addGreenery(this, space.id);
                  this.plants -= this.plantsNeededForGreenery;
                  this.takeActionForFinalGreenery(game);
                  return undefined;
                }
            )
        );
        this.setWaitingFor(action);
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
        if (this.playedCards.find(
          (playedCard) => playedCard.name === CardName.PSYCHROPHILES) !== undefined 
           && card.tags.indexOf(Tags.PLANT) !== -1) {
            maxPay += this.getResourcesOnCardname(CardName.PSYCHROPHILES) * 2;
        }
        if (this.playedCards.find(
          (playedCard) => playedCard.name === CardName.DIRIGIBLES) !== undefined 
           && card.tags.indexOf(Tags.VENUS) !== -1) {
            maxPay += this.getResourcesOnCardname(CardName.DIRIGIBLES) * 3;
        }

        maxPay += this.megaCredits;
        return maxPay >= this.getCardCost(game, card) &&
                   card.canPlay(this, game);
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
      standardProjects.title = 'Pay for a standard project';

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

      return standardProjects;
    }

    public takeAction(game: Game): void {

      //Post Action (after some specific prelude cards have been played)
      if (this.postAction && this.getPlayableCards(game).length > 0) {
        const input = this.playProjectCard(game);
        this.setWaitingFor(input);
        this.postAction = false;
        return;
      } else if (this.postAction && this.getPlayableCards(game).length === 0) {
        this.postAction = false;
        return;
      }
      
      //Prelude cards have to be played first
      if (this.preludeCardsInHand.length > 0) {
        const input = this.playPreludeCard(game);
        input.onend = () => {
          if (this.postAction) {
            this.takeAction(game);
          }  
        };
        this.setWaitingFor(input);
        return;
      }

      if (
        game.getGeneration() === 1 &&
            this.corporationCard !== undefined &&
            !this.actionsThisGeneration.has(INITIAL_ACTION) &&
            this.corporationCard.initialAction !== undefined &&
            this.actionsTakenThisRound < 2
      ) {
        const input = this.corporationCard.initialAction(this, game);
        if (input !== undefined) {
          input.onend = () => {
            this.actionsThisGeneration.add(INITIAL_ACTION);
            this.actionsTakenThisRound++;
            this.takeAction(game);
          };
          this.setWaitingFor(input);
        } else {
          this.actionsThisGeneration.add(INITIAL_ACTION);
          this.actionsTakenThisRound++;
          this.takeAction(game);
        }
        return;
      }

      if (this.actionsTakenThisRound >= 2) {
        this.actionsTakenThisRound = 0;
        this.lastCardPlayedThisTurn = undefined;
        game.playerIsFinishedTakingActions(this);
        return;
      }         

      const action: OrOptions = new OrOptions();
      action.title = 'Take action for action phase, select one ' +
                       'available action.';

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
        this.heat >= constants.HEAT_FOR_TEMPERATURE &&
            game.getTemperature() + 2 <= constants.MAX_TEMPERATURE) {
        action.options.push(
            this.convertHeatIntoTemperature(game)
        );
      }

      if (this.canAfford(8) && !game.allMilestonesClaimed()) {
        const remainingMilestones = new OrOptions();
        remainingMilestones.title = 'Select a milestone to claim';
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
        remainingAwards.title = 'Select an award to fund';
        remainingAwards.options = game.awards
            .filter((award: IAward) => game.hasBeenFunded(award) === false)
            .map((award: IAward) => this.fundAward(award, game));
        action.options.push(remainingAwards);
      }

      action.options.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        } else if (a.title < b.title) {
          return -1;
        }
        return 0;
      });

      this.setWaitingFor(action);
    }

    public process(input: Array<Array<string>>): void {
      if (this.waitingFor === undefined) {
        throw new Error('Not waiting for anything');
      }
      const waitingFor = this.waitingFor;
      this.waitingFor = undefined;
      try {
        const subsequent = this.runInput(input, waitingFor);
        if (subsequent !== undefined) {
          if (
            subsequent.onend === undefined &&
                    waitingFor.onend !== undefined) {
            subsequent.onend = waitingFor.onend;
          }
          this.setWaitingFor(subsequent);
        } else if (waitingFor.onend) {
          waitingFor.onend();
        }
      } catch (err) {
        console.warn('Error running input', err);
        this.waitingFor = waitingFor;
        throw err;
      }
    }

    public getWaitingFor(): PlayerInput | undefined {
      return this.waitingFor;
    }

    public setWaitingFor(input: PlayerInput): void {
      this.waitingFor = input;
    }

    public reduceActionsTakenThisRound(): void {
      this.actionsTakenThisRound--;
    }
}

