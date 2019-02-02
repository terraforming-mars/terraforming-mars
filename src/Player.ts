
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
import { SelectOption } from "./inputs/SelectOption";
import * as constants from "./constants";

export class Player {
    constructor(public name: string, public color: Color, public beginner: boolean) {

    }

    public corporationCard: CorporationCard | undefined = undefined;

    public canUseHeatAsMegaCredits: boolean = false;
    public greeneryCost: number = 8;
    public powerPlantCost: number = 11;
    public opponentsCanRemovePlants: boolean = true;
    public opponentsCanRemoveAnimals: boolean = true;
    public opponentsCanRemoveMicrobes: boolean = true;
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
    public onCardSelected: Function | undefined;
    public onTilePlaced: Function = () => {};
    public plants: number = 0;
    public plantProduction: number = 0;
    public cardsInHand: Array<IProjectCard> = [];
    public playedCards: Array<IProjectCard> = [];
    private actionsTakenThisRound: number = 0;
    private cardDiscounts: Array<CardDiscount> = [];
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
    public removeCardDiscount(discount: CardDiscount): void {
        for (var i = 0; i < this.cardDiscounts.length; i++) {
            if (this.cardDiscounts[i] === discount) {
                this.cardDiscounts.splice(i, 1);
                return;
            }
        }
        throw "Did not find card discount.";
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
    public cardPlayedEvents: Array<Function> = [];
    public addCardPlayedHandler(handler: Function): void {
        this.cardPlayedEvents.push(handler);
    } 
    public removeCardPlayedHandler(handler: Function): void {
        this.cardPlayedEvents.splice(this.cardPlayedEvents.indexOf(handler), 1);
    }
    private standardProjectHandler: Array<Function> = [];

    public addStandardProjectHandler(fn: Function): void {
        this.standardProjectHandler.push(fn);
    }

    private runInput(input: Array<Array<string>>, pi: PlayerInput): void {
        if (pi instanceof AndOptions) {
            const waiting: AndOptions = pi;
            if (input.length !== waiting.options.length) {
                throw "Not all options provided";
            }
            for (let i = 0; i < input.length; i++) {
                this.runInput([input[i]], waiting.options[i]);
            }
            pi.cb();
        } else if (pi instanceof OrOptions) {
            const waiting: OrOptions = pi;
            const optionIndex = parseInt(input[0][0]);
            const remainingInput = input.slice();
            remainingInput.splice(0, 1);
            this.runInput(remainingInput, waiting.options[optionIndex]);
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
            if (mappedCards.length !== input[0].length) {
                throw "Not all cards found";
            }
            pi.cb(mappedCards);
        } else if (pi instanceof SelectHowToPay) {
            if (input.length !== 1) {
                throw "Incorrect options provided";
            }
            if (input[0].length !== 1) {
                throw "Incorrect input provided";
            }
            let payMethod: HowToPay = {
                steel: 0,
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
            pi.cb(payMethod);
        } else {
            throw "Unsupported waitingFor";
        }
    }

    private getPlayedActionCards(): Array<ICard> {
        const result: Array<ICard> = [];
        if (this.corporationCard && this.corporationCard.action !== undefined) {
            result.push(this.corporationCard);
        }
        for (let playedCard of this.playedCards) {
            if (playedCard.action !== undefined) {
                result.push(playedCard);
            }
        }
        return result;
    }

    public hasInitialActionFromCorporation(): boolean {
        return this.corporationCard !== undefined && this.corporationCard.action !== undefined;
    }

    public runProductionPhase(): void {
        this.megaCredits += this.megaCreditProduction + this.terraformRating;
        this.heat += this.energy;
        this.heat += this.heatProduction;
        this.energy += this.energyProduction;
        this.titanium += this.titaniumProduction;
        this.steel += this.steelProduction;
        this.plants += this.plantProduction;
    }

    public runResearchPhase(game: Game): void {
        this.setWaitingFor(new SelectCard("Research Phase", "Select which cards to take into hand", game.dealer.getCards(4), (foundCards: Array<IProjectCard>) => {
            if (foundCards.length * 4 > this.megaCredits) {
                throw "Not enough money to purchase patents";
            }
            this.megaCredits -= 4 * foundCards.length;
            foundCards.forEach((card) => {
                this.cardsInHand.push(card);
            });
            game.playerIsFinishedWithResearchPhase(this); 
        }, 4, 0)); 
    }

    private playProjectCard(game: Game): PlayerInput {

        let selectedCard: IProjectCard;
        let payMethod: HowToPay;

        return new AndOptions(
            () => {

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

                if (totalToPay < selectedCard.cost) {
                    throw "Did not spend enough to pay for card";
                }

                this.steel -= payMethod.steel;
                this.titanium -= payMethod.titanium;
                this.megaCredits -= payMethod.megaCredits;
                if (payMethod.heat !== undefined) {
                    this.heat -= payMethod.heat;
                }

                // Play the card
                selectedCard.play(this, game)
                    .then(() => {
                        this.actionsTakenThisRound++;
                        this.takeAction(game);
                    })
                    .catch((err) => {
                        console.warn("Error playing project card", err);
                        this.waitingFor = undefined;
                    });
            },
            new SelectCard("Take Action!", "Play a project card", this.cardsInHand, (foundCards: Array<IProjectCard>) => {
                selectedCard = foundCards[0];
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
            })
        );
    }

    private playActionCard(game: Game): PlayerInput {
        return new SelectCard("Take Action!", "Perform an action from a played card", this.getPlayedActionCards(), (foundCards: Array<ICard>) => {
            const foundCard = foundCards[0];
            foundCard.action!(this, game)
                .then(() => {
                    this.actionsTakenThisRound++;
                    this.takeAction(game);
                })
                .catch((err: string) => {
                    console.warn("Error taking action from card", err);
                    this.takeAction(game); 
                })
        });
    }

    private sellPatents(game: Game): PlayerInput {
        return new SelectCard("Take Action!", "Sell patents", this.cardsInHand, (foundCards: Array<IProjectCard>) => {
            this.megaCredits += foundCards.length;
            foundCards.forEach((card) => {
                game.dealer.discard(card);
            });
            this.actionsTakenThisRound++;
            this.takeAction(game);
        }, this.cardsInHand.length);
    }

    private buildPowerPlant(game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Standard Project: Power Plant", () => {
            this.energyProduction++;
            this.megaCredits -= 11;
            this.actionsTakenThisRound++;
            this.takeAction(game);
        });
    }

    private asteroid(game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Standard Project: Asteroid", () => {
            game.increaseTemperature(this)
                .then(() => {
                    this.megaCredits -= 14;
                    this.actionsTakenThisRound++;
                    this.takeAction(game);
                })
                .catch((err: string) => {
                    throw "Error raising temperature " + err;
                });
        });
    }

    private aquifer(game: Game): PlayerInput {
        return new SelectSpace("Take Action!", "Standard Project: Aquifer", (space: ISpace) => {
            game.addOceanTile(this, space.id);
            this.megaCredits -= 14;
            this.actionsTakenThisRound++;
            this.takeAction(game);
        });
    }

    private addGreenery(game: Game): PlayerInput {
        return new SelectSpace("Take Action!", "Standard Project: Greenery", (space: ISpace) => {
            game.addGreenery(this, space.id);
            this.megaCredits -= 23;
            this.actionsTakenThisRound++;
            this.takeAction(game);
        });
    }

    private addCity(game: Game): PlayerInput {
        return new SelectSpace("Take Action!", "Standard Project: City", (space: ISpace) => {
            game.addCityTile(this, space.id);
            this.megaCredits -= 25;
            this.actionsTakenThisRound++;
            this.takeAction(game);
        });
    }

    private passOption(game: Game): PlayerInput {
        return new SelectOption("Take Action!", "Pass", () => {
            game.playerHasPassed(this);
        });
    }

    public takeAction(game: Game): void {

        if (this.actionsTakenThisRound >= 2) {
            game.playerIsFinishedTakingActions(this);
            return undefined;
        }

        const action: OrOptions = new OrOptions();

        action.options.push(
            this.playProjectCard(game)
        );
 
        action.options.push(
            this.playActionCard(game)
        );

        action.options.push(
            this.passOption(game)
        );

        if (this.cardsInHand.length >= 0) {
            action.options.push(
                this.sellPatents(game)
            );
        }

        if (this.megaCredits >= 11) {
            action.options.push(
                this.buildPowerPlant(game)
            );
        }

        if (this.megaCredits >= 14 && game.getTemperature() < constants.MAX_TEMPERATURE) {
            action.options.push(
                this.asteroid(game)
            )
        }

        if (this.megaCredits >= 18 && game.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
            action.options.push(
                this.aquifer(game)
            );
        }

        if (this.megaCredits >= 23) {
            action.options.push(
                this.addGreenery(game)
            );
        }

        if (this.megaCredits >= 25) {
            action.options.push(
                this.addCity(game)
            );
        }

        this.setWaitingFor(action);
    }

    public process(input: Array<Array<string>>): void {
        if (this.waitingFor === undefined) {
            throw "Not waiting for anything";
        }
        const waitingFor = this.waitingFor;
        this.waitingFor = undefined;
        this.runInput(input, waitingFor);
    }

    private waitingFor?: PlayerInput;

    public getWaitingFor(): PlayerInput | undefined {
        return this.waitingFor;
    }

    public setWaitingFor(input: PlayerInput): void {
        this.waitingFor = input;
    }

}

