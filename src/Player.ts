import {IProjectCard} from './cards/IProjectCard';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {SaturnSystems} from './cards/corporation/SaturnSystems';
import {Psychrophiles} from './cards/prelude/Psychrophiles';
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
import {ORIGINAL_MILESTONES} from './milestones/Milestones';
import {StandardProjectType} from './StandardProjectType';
import * as constants from './constants';
import {ProtectedHabitats} from './cards/ProtectedHabitats';
import {Pets} from './cards/Pets';
import {ORIGINAL_AWARDS} from './awards/Awards';
import {IAward} from './awards/IAward';

const INITIAL_ACTION: string = 'INITIAL';
const PRELUDE_ACTION: string = 'PRELUDE';

export class Player {
    public corporationCard: CorporationCard | undefined = undefined;
    public id: string;
    public canUseHeatAsMegaCredits: boolean = false;
    public canUseMicrobesAsMegaCreditsForPlants = false;
    public plantsNeededForGreenery: number = 8;
    public dealtCorporationCards: Array<CorporationCard> = [];
    public powerPlantCost: number = 11;
    public titaniumValue: number = 3;
    public steelValue: number = 2;
    public megaCredits: number = 0;
    public megaCreditProduction: number = 0;
    public steel: number = 0;
    public titanium: number = 0;
    public energy: number = 0;
    public steelProduction: number = 0;
    public titaniumProduction: number = 0;
    public energyProduction: number = 0;
    public heat: number = 0;
    public heatProduction: number = 0;
    public plants: number = 0;
    public plantProduction: number = 0;
    public cardsInHand: Array<IProjectCard> = [];
    public preludeCardsInHand: Array<IProjectCard> = [];    
    public playedCards: Array<IProjectCard> = [];
    public generationPlayed: Map<string, number> = new Map<string, number>();
    public actionsTakenThisRound: number = 0;
    public terraformRating: number = 20;
    public terraformRatingAtGenerationStart: number = 20;
    public resourcesOnCards: Map<string, number> = new Map<string, number>();
    public victoryPoints: number = 0;
    private actionsThisGeneration: Set<string> = new Set<string>();
    private lastCardPlayedThisTurn: IProjectCard | undefined;
    private waitingFor?: PlayerInput;

    constructor(
        public name: string,
        public color: Color,
        public beginner: boolean) {
      this.id = this.generateId();
    }
    public getLastCardPlayedThisTurn(): IProjectCard | undefined {
      return this.lastCardPlayedThisTurn;
    }
    private hasProtectedHabitats(): boolean {
      return this.playedCards.find(
          (playedCard) => playedCard.name === new ProtectedHabitats().name
      ) !== undefined;
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
      if (card.name === new Pets().name) {
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
    public getRequirementsBonus(game: Game): number {
      let requirementsBonus: number = 0;
      if (
        this.corporationCard !== undefined &&
            this.corporationCard.getRequirementBonus !== undefined) {
              requirementsBonus = this.corporationCard.getRequirementBonus(this, game);
      }
      for (let playedCard of this.playedCards) {
        if (playedCard.getRequirementBonus !== undefined &&
           playedCard.getRequirementBonus(this, game) > requirementsBonus ) {
            requirementsBonus = playedCard.getRequirementBonus(this, game);
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
    public getTagCount(tag: Tags): number {
      let tagCount = 0;
      this.playedCards.forEach((card: IProjectCard) => {
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
        const remainingInput = input.slice();
        remainingInput.splice(0, 1);
        return this.runInput(remainingInput, waiting.options[optionIndex]);
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
          microbes: 0
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
          if (this.canUseMicrobesAsMegaCreditsForPlants) {
            if (parsedInput.microbes !== undefined) {
              payMethod.microbes = parsedInput.microbes;
            }
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
          microbes: 0
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
          if (this.canUseMicrobesAsMegaCreditsForPlants) {
            if (parsedInput.microbes !== undefined) {
              payMethod.microbes = parsedInput.microbes;
            } else {
              throw new Error('Microbes not provided, bad input');
            }
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

    public runResearchPhase(game: Game): void {
      const dealtCards: Array<IProjectCard> = [];
      dealtCards.push(
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard()
      );
      let htp: HowToPay = {
        steel: 0,
        titanium: 0,
        heat: 0,
        megaCredits: 0,
        microbes: 0
      };

      let selectedCards: Array<IProjectCard> = [];

      const payForCards = () => {
        this.megaCredits -= constants.CARD_COST * selectedCards.length;
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
                false, (pay) => {
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
                  htp.megaCredits = foundCards.length *
                                            constants.CARD_COST;
                  selectedCards = foundCards;
                  payForCards();
                  return undefined;
                }, 4, 0
            )
        );
      }
    }

    private getCardCost(game: Game, card: IProjectCard): number {
      let cost: number = card.cost;
      this.playedCards.forEach((playedCard) => {
        if (playedCard.getCardDiscount !== undefined) {
          cost -= playedCard.getCardDiscount(this, game, card);
        }
      });
      return Math.max(cost, 0);
    }

    private addPlayedCard(game: Game, card: IProjectCard): void {
      this.playedCards.push(card);
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
            this.playCard(game, foundCards[0]);
            return undefined;
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
        } else if (canUseTitanium && howToPay.titanium > 0) {
          if (howToPay.titanium > this.titanium) {
            throw new Error('Do not have enough titanium');
          }
          totalToPay += howToPay.titanium * this.titaniumValue;
        }

        if (this.canUseHeatAsMegaCredits && howToPay.heat !== undefined) {
          totalToPay += howToPay.heat;
        }

        if (
          this.canUseMicrobesAsMegaCreditsForPlants &&
                howToPay.microbes !== undefined) {
          totalToPay += howToPay.microbes * 2;
        }

        if (howToPay.megaCredits > this.megaCredits) {
          throw new Error('Do not have enough mega credits');
        }

        totalToPay += howToPay.megaCredits;

        if (totalToPay < cardCost) {
          throw new Error('Did not spend enough to pay for card');
        }
        this.playCard(game, selectedCard);
        return undefined;
      };
      return new SelectHowToPayForCard(this.getPlayableCards(game), cb);
    }

    public playCard(game: Game, selectedCard: IProjectCard, howToPay?: HowToPay): PlayerInput | undefined { 
        const whenDone = () => {
          this.cardsInHand
              .splice(
                  this.cardsInHand
                      .findIndex(
                          (card) => card.name === selectedCard.name
                      ), 1
              );
          this.addPlayedCard(game, selectedCard);

          if (howToPay !== undefined) {
            this.steel -= howToPay.steel;
            this.titanium -= howToPay.titanium;
            this.megaCredits -= howToPay.megaCredits;
            this.heat -= howToPay.heat;
            for (const playedCard of this.playedCards) {
                if (playedCard.name === new Psychrophiles().name) {
                    this.removeResourceFrom(playedCard, howToPay.microbes);
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

          if (
            this.corporationCard !== undefined &&
                    this.corporationCard.onCardPlayed !== undefined
          ) {
            const method = this.corporationCard.onCardPlayed;
            if (
              this.corporationCard.name === new SaturnSystems().name
            ) {
              game
                  .getPlayers()
                  .forEach((player) => {
                    method(player, game, selectedCard);
                  });
            } else {
              method(this, game, selectedCard);
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

    private buildPowerPlant(game: Game): PlayerInput {
      const fundProject = (megaCredits: number, heat: number) => {
        this.energyProduction++;
        this.payForStandardProject(
            StandardProjectType.POWER_PLANT, megaCredits, heat
        );
        this.actionsTakenThisRound++;
        this.takeAction(game);
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Select how to pay for power plant',
            false, false, true, false,
            (htp) => {
              if (htp.heat + htp.megaCredits < this.powerPlantCost) {
                throw new Error(
                    'Haven\'t spend enough for power plant'
                );
              }
              return fundProject(htp.megaCredits, htp.heat);
            }
        );
      }
      return new SelectOption('Power Plant', () => {
        return fundProject(this.powerPlantCost, 0);
      });
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
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Select how to pay for asteroid',
            false, false, true, false,
            (htp) => {
              if (htp.heat + htp.megaCredits < constants.ASTEROID_COST) {
                throw new Error('Haven\'t spend enough for asteroid');
              }
              return fundProject(htp.megaCredits, htp.heat);
            }
        );
      }
      return new SelectOption('Asteroid', () => {
        return fundProject(constants.ASTEROID_COST, 0);
      });
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
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        let htp: HowToPay;
        let ocean: ISpace;
        return new AndOptions(() => {
          return fundProject(htp.megaCredits, htp.heat, ocean.id);
        }, new SelectHowToPay(
            'How to pay for aquifer', false, false, true, false,
            (stp: HowToPay) => {
              if (stp.heat + stp.megaCredits < constants.AQUIFER_COST) {
                throw new Error('Haven\'t spend enough for aquifer');
              }
              htp = stp;
              return undefined;
            }
        ), new SelectSpace(
            'Aquifer',
            game.getAvailableSpacesForOcean(this),
            (space: ISpace) => {
              ocean = space;
              return undefined;
            }
        ));
      }
      return new SelectSpace(
          'Aquifer',
          game.getAvailableSpacesForOcean(this),
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
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        let htp: HowToPay;
        let greenery: ISpace;
        return new AndOptions(() => {
          return fundProject(htp.megaCredits, htp.heat, greenery.id);
        }, new SelectHowToPay(
            'Select how to pay for greenery',
            false, false, true, false,
            (stp) => {
              htp = stp;
              return undefined;
            }
        ), new SelectSpace(
            'Greenery',
            game.getAvailableSpacesForGreenery(this),
            (space: ISpace) => {
              greenery = space;
              return undefined;
            }
        ));
      }
      return new SelectSpace(
          'Greenery',
          game.getAvailableSpacesForGreenery(this),
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
        this.megaCreditProduction++;
        this.payForStandardProject(
            StandardProjectType.CITY,
            megaCredits,
            heat
        );
        this.actionsTakenThisRound++;
        this.takeAction(game);
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        let city: ISpace;
        let htp: HowToPay;
        return new AndOptions(
            () => {
              return fundProject(htp.megaCredits, htp.heat, city.id);
            },
            new SelectHowToPay(
                'Select how to pay for city',
                false,
                false,
                true,
                false,
                (stp) => {
                  htp = stp;
                  return undefined;
                }
            ),
            new SelectSpace(
                'City',
                game.getAvailableSpacesOnLand(this),
                (space: ISpace) => {
                  city = space;
                  return undefined;
                }
            )
        );
      }
      return new SelectSpace(
          'City',
          game.getAvailableSpacesOnLand(this),
          (space: ISpace) => {
            return fundProject(constants.CITY_COST, 0, space.id);
          }
      );
    }

    private convertPlantsIntoGreenery(game: Game): PlayerInput {
      return new SelectSpace(
          `Convert ${this.plantsNeededForGreenery} plants into greenery`,
          game.getAvailableSpacesForGreenery(this),
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
        return undefined;
      });
    }

    private claimMilestone(
        milestone: IMilestone,
        game: Game): SelectHowToPay | SelectOption {
      const claimer = (megaCredits: number, heat: number) => {
        this.victoryPoints += 5;
        game.claimedMilestones.push({
          player: this,
          milestone: milestone
        });
        this.heat -= heat;
        this.megaCredits -= megaCredits;
        this.actionsTakenThisRound++;
        this.takeAction(game);
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Select how to pay ' + milestone.name,
            false,
            false,
            true,
            false,
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
        return undefined;
      };
      if (this.canUseHeatAsMegaCredits && this.heat > 0) {
        return new SelectHowToPay(
            'Select how to pay for ' + award.name,
            false,
            false,
            true,
            false,
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
                game.getAvailableSpacesForGreenery(this), (space) => {
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
        if (canUseSteel) {
          maxPay += this.steel * this.steelValue;
        }
        if (canUseTitanium) {
          maxPay += this.titanium * this.titaniumValue;
        }
        maxPay += this.megaCredits;
        return maxPay >= this.getCardCost(game, card) &&
                   card.canPlay(this, game);
      });
    }

    public canAfford(cost: number): boolean {
      return (this.canUseHeatAsMegaCredits ? this.heat : 0) +
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
            game.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
        standardProjects.options.push(
            this.aquifer(game)
        );
      }

      if (
        this.canAfford(constants.GREENERY_COST) &&
            game.getAvailableSpacesForGreenery(this).length > 0) {
        standardProjects.options.push(
            this.addGreenery(game)
        );
      }

      if (
        this.canAfford(constants.CITY_COST) &&
            game.getAvailableSpacesForGreenery(this).length > 0) {
        standardProjects.options.push(
            this.addCity(game)
        );
      }
      return standardProjects;
    }

    public takeAction(game: Game): void {

      //Prelude cards have to be played first
      if (this.preludeCardsInHand.length > 0) {
        const input = this.playPreludeCard(game);
        input.onend = () => {
          this.actionsThisGeneration.add(PRELUDE_ACTION);
          this.actionsTakenThisRound++;
          this.actionsTakenThisRound++;
          this.takeAction(game);
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
        input.onend = () => {
          this.actionsThisGeneration.add(INITIAL_ACTION);
          this.actionsTakenThisRound++;
          this.takeAction(game);
        };
        this.setWaitingFor(input);
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
            game.getAvailableSpacesForGreenery(this).length > 0) {
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
        remainingMilestones.options = ORIGINAL_MILESTONES
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
        remainingAwards.options = ORIGINAL_AWARDS
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

