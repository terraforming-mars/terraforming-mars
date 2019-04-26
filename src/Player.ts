
import { IProjectCard } from "./cards/IProjectCard";
import { CorporationCard } from "./cards/corporation/CorporationCard";
import { CardDiscount } from "./CardDiscount";
import { Tags } from "./cards/Tags";
import { PlayerInput } from "./PlayerInput";
import { CardType } from "./cards/CardType";
import { Color } from "./Color";
import { SelectCard } from "./inputs/SelectCard";
import { AndOptions } from "./inputs/AndOptions";
import { ICard } from "./cards/ICard";
import { OrOptions } from "./inputs/OrOptions";
import { Game } from "./Game";
import { HowToPay } from "./inputs/HowToPay";
import { SelectSpace } from "./inputs/SelectSpace";
import { ISpace } from "./ISpace";
import { SelectHowToPay } from "./inputs/SelectHowToPay";
import { SelectAmount } from "./inputs/SelectAmount";
import { SelectOption } from "./inputs/SelectOption";
import { SelectPlayer } from "./inputs/SelectPlayer";
import { SpaceBonus } from "./SpaceBonus";
import { Award } from "./Award";
import { Milestone } from "./Milestone";
import { TileType } from "./TileType";
import { StandardProjectType } from "./StandardProjectType";
import * as constants from "./constants";

import { ProtectedHabitats } from "./cards/ProtectedHabitats";
import { Pets } from "./cards/Pets";

type CardPlayedHandler = (card: IProjectCard) => OrOptions | void;

export class Player {
    constructor(public name: string, public color: Color, public beginner: boolean) {

    }
    private hasProtectedHabitats(): boolean {
        return this.playedCards.find((playedCard) => playedCard.name === new ProtectedHabitats().name) !== undefined;
    }
    public removePlants(removingPlayer: Player, count: number): void {
        if (removingPlayer !== this && this.hasProtectedHabitats()) {
            throw "Can not remove plants due to protected habitats";
        }
        this.plants = Math.max(0, this.plants - count);
    }
    public removeAnimals(removingPlayer: Player, card: IProjectCard, count: number): void {
        if (removingPlayer !== this && this.hasProtectedHabitats()) {
            throw "Can not remove animals due to protected habitats";
        }
        if (card.name === new Pets().name) {
            throw "Animals may not be removed from pets";
        }
        if (card.animals === undefined) {
            throw card.name + " does not have animals to remove";
        }
        card.animals = Math.max(0, card.animals - count);
    }
    public removeMicrobes(removingPlayer: Player, card: IProjectCard, count: number): void {
        if (removingPlayer !== this && this.hasProtectedHabitats()) {
            throw "Can not remove microbes due to protected habitats";
        }
        if (card.microbes === undefined) {
            throw card.name + " does not have microbes to remove";
        }
        card.microbes = Math.max(0, card.microbes - count);
    }
    public corporationCard: CorporationCard | undefined = undefined;
    public id: string = this.generateId();
    public canUseHeatAsMegaCredits: boolean = false;
    public plantsNeededForGreenery: number = 8;
    public powerPlantCost: number = 11;
    public titaniumValue: number = 3;
    public steelValue: number = 2;
    public requirementsBonus: number = 0;
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
    public onTilePlaced: (bonus: Array<SpaceBonus>) => void = () => {};
    public plants: number = 0;
    public plantProduction: number = 0;
    public cardsInHand: Array<IProjectCard> = [];
    public playedCards: Array<IProjectCard> = [];
    private actionsTakenThisRound: number = 0;
    public cardDiscounts: Array<CardDiscount> = [];
    public terraformRating: number = 20;
    public victoryPoints: number = 0;
    public addAnimalsToCard(card: IProjectCard, count: number): void {
        if (card.animals === undefined) {
            card.animals = 0;
        }
        card.animals += count;
    }
    public addCardDiscount(discount: CardDiscount): void {
        this.cardDiscounts.push(discount);
    }
    private generateId(): string {
        return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
    }
    public cardHasResource(card: IProjectCard): boolean {
        return card.animals !== undefined || card.microbes !== undefined || card.fighterResources !== undefined || card.scienceResources !== undefined;
    }
    public addResourceTo(card: IProjectCard): void {
        if (card.animals !== undefined) {
            card.animals++;
        } else if (card.microbes !== undefined) {
            card.microbes++;
        } else if (card.fighterResources !== undefined) {
            card.fighterResources++;
        } else if (card.scienceResources !== undefined) {
            card.scienceResources++;
        } else {
            throw "No resource on this card";
        }
    }
    public getCardsWithResources(): Array<IProjectCard> {
        return this.playedCards.filter((card) => this.cardHasResource(card));
    }
    public getTagCount(tag: Tags): number {
        let tagCount = 0;
        this.playedCards.forEach((card: IProjectCard) => {
            tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
        });
        if (this.corporationCard !== undefined) {
            tagCount += this.corporationCard.tags.filter((cardTag) => cardTag === tag).length;
        }
        return tagCount;
    }
    public getActiveAndAutomatedCards(): Array<IProjectCard> {
        return this.playedCards.filter((pc) => pc.cardType === CardType.AUTOMATED || pc.cardType === CardType.ACTIVE);
    }
    public getCard(cardName: string): IProjectCard {
        const foundCards = this.cardsInHand.filter((card) => card.name === cardName);
        if (foundCards.length === 0) {
            throw "Card not found";
        }
        return foundCards[0];
    }
    public cardPlayedEvents: Array<CardPlayedHandler> = [];
    public addCardPlayedHandler(handler: CardPlayedHandler): void {
        this.cardPlayedEvents.push(handler);
    } 
    public removeCardPlayedHandler(handler: CardPlayedHandler): void {
        this.cardPlayedEvents.splice(this.cardPlayedEvents.indexOf(handler), 1);
    }
    public standardProjectHandler: Array<(project: StandardProjectType) => void> = [];

    public addStandardProjectHandler(fn: (project: StandardProjectType) => void): void {
        this.standardProjectHandler.push(fn);
    }

    private runInput(input: Array<Array<string>>, pi: PlayerInput): PlayerInput | undefined {
        if (pi instanceof AndOptions) {
            const waiting: AndOptions = pi;
            if (input.length !== waiting.options.length) {
                throw "Not all options provided";
            }
            for (let i = 0; i < input.length; i++) {
                this.runInput([input[i]], waiting.options[i]);
            }
            return pi.cb();
        } else if (pi instanceof SelectAmount) {
            const waiting: SelectAmount = pi;
            if (input.length !== 1) {
                throw "Incorrect options provided";
            }
            if (input[0].length !== 1) {
                throw "Incorrect number of amounts provided";
            }
            const amount: number = parseInt(input[0][0]);
            if (isNaN(amount)) {
                throw "Number not provided for amount";
            }
            if (amount > waiting.max) {
                throw "Amount provided too high";
            }
            if (amount < 0) {
                throw "Amount provided too low";
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
        } else if (pi instanceof SelectCard) {
            if (input.length !== 1) {
                throw "Incorrect options provided";
            }
            const mappedCards: Array<ICard> = [];
            for (let cardName of input[0]) {
                for (let card of pi.cards) {
                    if (card.name === cardName) {
                        mappedCards.push(card);
                    }
                }
            }
            if (input[0].length < pi.minCardsToSelect) {
                console.warn("selected cards", input[0]);
                throw "Not enough cards selected";
            }
            if (input[0].length > pi.maxCardsToSelect) {
                console.warn("selected cards", input[0]);
                throw "Too many cards selected";
            }
            if (mappedCards.length !== input[0].length) {
                throw "Not all cards found";
            }
            return pi.cb(mappedCards);
        } else if (pi instanceof SelectAmount) {
            if (input.length !== 1) {
                throw "Incorrect options provided";
            }
            if (input[0].length !== 1) {
                throw "Too many amounts provided";
            }
            if (isNaN(parseInt(input[0][0]))) {
                throw "Amount is not a number";
            }
            return pi.cb(parseInt(input[0][0]));
        } else if (pi instanceof SelectSpace) {
            if (input.length !== 1) {
                throw "Incorrect options provided";
            }
            if (input[0].length !== 1) {
                throw "Too many spaces provided";
            }
            const foundSpace = pi.availableSpaces.find((space) => space.id === input[0][0]);
            if (foundSpace === undefined) {
                throw "Space not available";
            }
            return pi.cb(foundSpace);
        } else if (pi instanceof SelectPlayer) {
            if (input.length !== 1) {
                throw "Incorrect options provided";
            }
            if (input[0].length !== 1) {
                throw "Invalid players array provided";
            }
            const foundPlayer = pi.players.find((player) => player.id === input[0][0]);
            if (foundPlayer === undefined) {
                throw "Player not available";
            }
            return pi.cb(foundPlayer);
        } else if (pi instanceof SelectHowToPay) {
            if (input.length !== 1) {
                throw "Incorrect options provided";
            }
            if (input[0].length !== 1) {
                throw "Incorrect input provided";
            }
            let payMethod: HowToPay = {
                steel: 0,
                heat: 0,
                titanium: 0,
                megaCredits: 0
            };
            if (this.canUseHeatAsMegaCredits) {
                payMethod.heat = 0;
            }
            try {
                const parsedInput: {[x: string]: number} = JSON.parse(input[0][0]);
                if (parsedInput.steel !== undefined) {
                    payMethod.steel = parsedInput.steel;
                } else {
                    throw "Steel not provided, bad input";
                }
                if (parsedInput.titanium !== undefined) {
                    payMethod.titanium = parsedInput.titanium;
                } else {
                    throw "Titanium not provided, bad input";
                }
                if (parsedInput.megaCredits !== undefined) {
                    payMethod.megaCredits = parsedInput.megaCredits;
                } else {
                    throw "Mega credits not provided, bad input";
                }
                if (this.canUseHeatAsMegaCredits) {
                    if (parsedInput.heat !== undefined) {
                        payMethod.heat = parsedInput.heat;
                    } else {
                        throw "Heat not provided, bad input";
                    }
                }
            } catch (err) {
                throw "Unable to parse input " + err;
            }
            return pi.cb(payMethod);
        } else {
            throw "Unsupported waitingFor";
        }
    }

    private actionsThisGeneration: Set<string> = new Set<string>();

    private getPlayableActionCards(): Array<ICard> {
        const result: Array<ICard> = [];
        if (this.corporationCard !== undefined && !this.actionsThisGeneration.has(this.corporationCard.name) && this.corporationCard.action !== undefined) {
            result.push(this.corporationCard);
        }
        for (let playedCard of this.playedCards) {
            if (playedCard.action !== undefined && !this.actionsThisGeneration.has(playedCard.name)) {
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
        for (let i = 0; i < 4; i++) {
            dealtCards.push(game.dealer.dealCard());
        }
        this.setWaitingFor(new SelectCard("Research Phase", "Select which cards to take into hand", dealtCards, (foundCards: Array<IProjectCard>) => {
            if (foundCards.length * constants.CARD_COST > this.megaCredits) {
                throw "Not enough money to purchase patents";
            }
            // TODO - how much does this cost?
            this.megaCredits -= constants.CARD_COST * foundCards.length;
            foundCards.forEach((card) => {
                this.cardsInHand.push(card);
            });
            // Discard the cards which were not purchased.
            dealtCards
                .filter((card) => foundCards.find((foundCard) => foundCard.name === card.name) === undefined)
                .forEach((card) => {
                    game.dealer.discard(card);
                }); 
            game.playerIsFinishedWithResearchPhase(this);
            return undefined; 
        }, 4, 0)); 
    }

    private getCardCost(card: IProjectCard): number {
        let cost: number = card.cost;
        this.cardDiscounts.forEach((cardDiscount) => {
            cost -= cardDiscount(card);
        });
        return Math.max(cost, 0);
    }

    private playProjectCard(game: Game): PlayerInput {

        let selectedCard: IProjectCard;
        let payMethod: HowToPay;

        return new AndOptions(
            () => {

                const cardCost: number = this.getCardCost(selectedCard);
                let totalToPay: number = 0;

                const canUseSteel: boolean = selectedCard.tags.indexOf(Tags.STEEL) !== -1;
                const canUseTitanium: boolean = selectedCard.tags.indexOf(Tags.SPACE) !== -1;

                if (canUseSteel && payMethod.steel) {
                    totalToPay += payMethod.steel * this.steelValue;
                } else if (canUseTitanium && payMethod.titanium) {
                    totalToPay += payMethod.titanium * this.titaniumValue;
                }

                if (this.canUseHeatAsMegaCredits && payMethod.heat !== undefined) {
                    totalToPay += payMethod.heat;
                }

                totalToPay += payMethod.megaCredits;

                if (totalToPay < cardCost) {
                    throw "Did not spend enough to pay for card";
                }

                const whenDone = () => {
                    this.cardsInHand.splice(this.cardsInHand.findIndex((card) => card.name === selectedCard.name), 1);
                    this.playedCards.push(selectedCard);


                    this.steel -= payMethod.steel;
                    this.titanium -= payMethod.titanium;
                    this.megaCredits -= payMethod.megaCredits;
                    if (payMethod.heat !== undefined) {
                        this.heat -= payMethod.heat;
                    }

                    const actionsFromPlayedCard: OrOptions[] = [];
                    this.cardPlayedEvents.slice().forEach((cardPlayedEvent) => {
                        const actionFromPlayedCard: OrOptions | void = cardPlayedEvent(selectedCard);
                        if (actionFromPlayedCard !== undefined) {
                            actionsFromPlayedCard.push(actionFromPlayedCard);
                        }
                    });
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
                }

                // Play the card
                const action = selectedCard.play(this, game);
                if (action !== undefined) {
                    action.onend = whenDone;
                    return action;
                }
                whenDone();
                return undefined;
            },
            new SelectCard("Take Action!", "Play a project card", this.getPlayableCards(game), (foundCards: Array<IProjectCard>) => {
                selectedCard = foundCards[0];
                return undefined;
            }),
            new SelectHowToPay("Take Action!", "How will you pay for card?", true, true, this.canUseHeatAsMegaCredits, (howToPay: HowToPay) => {
                payMethod = howToPay;
                if (payMethod.steel && payMethod.steel > this.steel) {
                    throw "Not enough steel";
                }
                if (payMethod.heat && !this.canUseHeatAsMegaCredits) {
                    throw "Can't use heat as mega credits";
                }
                if (payMethod.heat && payMethod.heat > this.heat) {
                    throw "Not enough heat";
                }
                if (payMethod.titanium && payMethod.titanium > this.titanium) {
                    throw "Not enough titanium";
                }
                if (payMethod.megaCredits > this.megaCredits) {
                    throw "Not enough mega credits";
                }
                return undefined;
            })
        );
    }

    private playActionCard(game: Game): PlayerInput {
        return new SelectCard("Take Action!", "Perform an action from a played card", this.getPlayableActionCards(), (foundCards: Array<ICard>) => {
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
        });
    }

    private payForStandardProject(projectType: StandardProjectType, amount: number): void {
        this.megaCredits -= amount;
        this.standardProjectHandler.forEach((fn) => {
            fn(projectType);
        });
    }

    private sellPatents(game: Game): PlayerInput {
        var res = new SelectCard("Take Action!", "Sell patents", this.cardsInHand, (foundCards: Array<IProjectCard>) => {
            this.payForStandardProject(StandardProjectType.SELLING_PATENTS, -foundCards.length);
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
        }, this.cardsInHand.length);
        res.onend = (err?: string) => {
            if (!err) {
                this.actionsTakenThisRound++;
            }
            this.takeAction(game);
        };
        return res;
    }

    private buildPowerPlant(game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Standard Project: Power Plant", () => {
            this.energyProduction++;
            this.payForStandardProject(StandardProjectType.POWER_PLANT, this.powerPlantCost);
            this.actionsTakenThisRound++;
            this.takeAction(game);
            return undefined;
        });
    }

    private asteroid(game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Standard Project: Asteroid", () => {
            const action = game.increaseTemperature(this, 1);
            const whenDone = (err?: string) => {
                if (!err) {
                    this.payForStandardProject(StandardProjectType.ASTEROID, 14);
                    this.actionsTakenThisRound++;
                }
                this.takeAction(game);
            }
            if (action !== undefined) {
                action.onend = whenDone;
                return action;
            }
            whenDone();
            return undefined;
        });
    }

    private aquifer(game: Game): PlayerInput {
        return new SelectSpace("Take Action!", "Standard Project: Aquifer", game.getAvailableSpacesForOcean(this), (space: ISpace) => {
            game.addOceanTile(this, space.id);
            this.payForStandardProject(StandardProjectType.AQUIFER, 18);
            this.actionsTakenThisRound++;
            this.takeAction(game);
            return undefined;
        });
    }

    private addGreenery(game: Game): PlayerInput {
        return new SelectSpace("Take Action!", "Standard Project: Greenery", game.getAvailableSpacesForGreenery(this), (space: ISpace) => {
            const action = game.addGreenery(this, space.id);
            const whenDone = (err?: string) => {
                if (!err) {
                    this.payForStandardProject(StandardProjectType.GREENERY, 23);
                    this.actionsTakenThisRound++;
                }
                this.takeAction(game);
            }
            if (action !== undefined) {
                action.onend = whenDone;
                return action;
            }
            whenDone();
            return undefined;
        });
    }

    private addCity(game: Game): PlayerInput {
        return new SelectSpace("Take Action!", "Standard Project: City", game.getAvailableSpacesOnLand(this), (space: ISpace) => {
            game.addCityTile(this, space.id);
            this.megaCreditProduction++;
            this.payForStandardProject(StandardProjectType.CITY, 25);
            this.actionsTakenThisRound++;
            this.takeAction(game);
            return undefined;
        });
    }

    private convertPlantsIntoGreenery(game: Game): PlayerInput {
        return new SelectSpace("Take Action!", "Convert " + this.plantsNeededForGreenery + " plants into greenery", game.getAvailableSpacesForGreenery(this), (space: ISpace) => {
            const action = game.addGreenery(this, space.id);
            const whenDone = (err?: string) => {
                if (!err) {
                    this.plants -= this.plantsNeededForGreenery;
                    this.actionsTakenThisRound++;
                }
                this.takeAction(game);
            }
            if (action !== undefined) {
                action.onend = whenDone;
                return action;
            }
            whenDone();
            return undefined;
        });
    }

    private convertHeatIntoTemperature(game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Convert 8 heat into temperature", () => {
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

    private claimMilestone(milestone: Milestone, game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Claim Milestone: " + milestone, () => {
            this.victoryPoints += 5;
            game.claimedMilestones.push({
                player: this,
                milestone: milestone
            });
            this.megaCredits -= 8;
            this.actionsTakenThisRound++;
            this.takeAction(game);
            return undefined;
        });
    }

    private fundAward(award: Award, game: Game): PlayerInput {
        let upperCaseAward = String(award)[0].toUpperCase() + String(award).substring(1);
        return new SelectOption("Take Action!", "Fund Award: " + upperCaseAward, () => {
            game.fundAward(this, award);
            this.megaCredits -= game.awardFundingCost;
            this.actionsTakenThisRound++;
            this.takeAction(game);
            return undefined;
        });
    }

    private passOption(game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Pass", () => {
            game.playerHasPassed(this);
            return undefined;
        });
    }

    public takeActionForFinalGreenery(game: Game): void {
        if (game.canPlaceGreenery(this)) {
            const action: OrOptions = new OrOptions();
            action.title = "Place any final greenery from plants";
            action.options.push(
                new SelectOption("Don't or can't place a greenery", "Pass", () => {
                    game.playerIsDoneWithGame(this);
                    return undefined;
                })
            );
            action.options.push(
                new SelectSpace("Place final greenery", "Select space for greenery", game.getAvailableSpacesForGreenery(this), (space) => {
                    game.addGreenery(this, space.id);
                    this.takeActionForFinalGreenery(game);
                    return undefined;
                })
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
            return maxPay >= this.getCardCost(card) && card.canPlay(this, game);
        });
    }

    public takeAction(game: Game): void {
        if (
            game.getGeneration() === 1 &&
            this.corporationCard !== undefined &&
            !this.actionsThisGeneration.has("INITIAL") &&
            this.corporationCard.initialAction !== undefined
        ) {
            const input = this.corporationCard.initialAction(this, game);
            input.onend = () => {
                this.actionsThisGeneration.add("INITIAL");
                this.actionsTakenThisRound++;
                this.takeAction(game);
            };
            this.setWaitingFor(input);
            return;
        }

        if (this.actionsTakenThisRound >= 2) {
            this.actionsTakenThisRound = 0;
            game.playerIsFinishedTakingActions(this);
            return;
        }

        const action: OrOptions = new OrOptions();
        action.title = "Take action for action phase, select one available action.";

        if (this.getPlayableCards(game).length > 0) {
            action.options.push(
                this.playProjectCard(game)
            );
        }
 
        if (this.getPlayableActionCards().length > 0) {
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

        // STANDARD PROJECTS
        const standardProjects = new OrOptions();
        standardProjects.title = "Take action!";
        standardProjects.message = "Pay for standard project";

        if (this.megaCredits >= this.powerPlantCost) {
            standardProjects.options.push(
                this.buildPowerPlant(game)
            );
        }

        if (this.megaCredits >= 14 && game.getTemperature() < constants.MAX_TEMPERATURE) {
            standardProjects.options.push(
                this.asteroid(game)
            )
        }

        if (this.megaCredits >= 18 && game.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
            standardProjects.options.push(
                this.aquifer(game)
            );
        }

        if (this.megaCredits >= 23) {
            standardProjects.options.push(
                this.addGreenery(game)
            );
        }

        if (this.megaCredits >= 25) {
            standardProjects.options.push(
                this.addCity(game)
            );
        }

        if (standardProjects.options.length > 1) {
            action.options.push(standardProjects);
        } else if (standardProjects.options.length === 1) {
            action.options.push(standardProjects.options[0]);
        }

        if (this.plants >= this.plantsNeededForGreenery) {
            action.options.push(
                this.convertPlantsIntoGreenery(game)
            );
        }

        if (this.heat >= constants.HEAT_FOR_TEMPERATURE) {
            action.options.push(
                this.convertHeatIntoTemperature(game)
            );
        }

        if (this.megaCredits >= 8 && !game.allMilestonesClaimed()) {
            const remainingMilestones = new OrOptions();
            remainingMilestones.title = "Take action!";
            remainingMilestones.message = "Select milestone to claim";
             
            if (!game.milestoneClaimed(Milestone.TERRAFORMER) && this.terraformRating >= 35) {
                remainingMilestones.options.push(
                    this.claimMilestone(Milestone.TERRAFORMER, game)
                );
            }
            if (!game.milestoneClaimed(Milestone.MAYOR) && game.getSpaceCount(TileType.CITY, this) >= 3) {
                remainingMilestones.options.push(
                    this.claimMilestone(Milestone.MAYOR, game)
                );
            }
            if (!game.milestoneClaimed(Milestone.GARDENER) && game.getSpaceCount(TileType.GREENERY, this) >= 3) {
                remainingMilestones.options.push(
                    this.claimMilestone(Milestone.GARDENER, game)
                );
            }
            if (!game.milestoneClaimed(Milestone.BUILDER) && this.getTagCount(Tags.STEEL) >= 8) {
                remainingMilestones.options.push(
                    this.claimMilestone(Milestone.BUILDER, game)
                );
            }
            if (!game.milestoneClaimed(Milestone.PLANNER) && this.cardsInHand.length >= 16) {
                remainingMilestones.options.push(
                    this.claimMilestone(Milestone.PLANNER, game)
                );
            }
            if (remainingMilestones.options.length > 1) {
                action.options.push(remainingMilestones);
            } else if (remainingMilestones.options.length === 1) {
                action.options.push(remainingMilestones.options[0]);
            }
        }

        if (this.megaCredits >= game.awardFundingCost && !game.allAwardsFunded()) {
            const remainingAwards = new OrOptions();
            remainingAwards.title = "Take action!";
            remainingAwards.message = "Fund an award";
            [Award.LANDLORD, Award.BANKER, Award.SCIENTIST, Award.THERMALIST, Award.MINER]
                .filter((award: Award) => game.hasBeenFunded(award) === false)
                .forEach((award: Award) => {
                    remainingAwards.options.push(
                        this.fundAward(award, game)
                    );
                });
            action.options.push(remainingAwards);
        }

        this.setWaitingFor(action);
    }

    public process(input: Array<Array<string>>): void {
        if (this.waitingFor === undefined) {
            throw "Not waiting for anything";
        }
        const waitingFor = this.waitingFor;
        this.waitingFor = undefined;
        try {
            const subsequent = this.runInput(input, waitingFor);
            if (subsequent !== undefined) {
                if (subsequent.onend === undefined && waitingFor.onend !== undefined) {
                    subsequent.onend = waitingFor.onend;
                }
                this.setWaitingFor(subsequent);
            } else if (waitingFor.onend) {
                waitingFor.onend();
            }
        } catch (err) {
            console.warn("Error running input", err);
            this.waitingFor = waitingFor;
            throw err;
        }
    }

    private waitingFor?: PlayerInput;

    public getWaitingFor(): PlayerInput | undefined {
        return this.waitingFor;
    }

    public setWaitingFor(input: PlayerInput): void {
        this.waitingFor = input;
    }

}

