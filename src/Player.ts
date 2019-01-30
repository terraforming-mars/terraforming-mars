
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
import { SelectHowToPay } from "./inputs/SelectHowToPay";

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

    private hasToTakeInitialAction(): boolean {
        return false;
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

    public takeAction(game: Game): void {

        // You have taken all actions
        // Notify the game
        if (this.actionsTakenThisRound >= 2) {
            game.playerIsFinishedTakingActions(this);
            return undefined;
        }

        // If corporation card gave us an action
        // to take first we must do it first.

        // This would only happen on the first generation
        // With certain corporation cards. If so we wait until that action is completed and already have a waitingFor.
        if (this.hasToTakeInitialAction()) {
            return undefined;
        }

        const action: OrOptions = new OrOptions();

        action.options.push(
            this.playProjectCard(game)
        );
 
        action.options.push(new SelectCard("Take Action!", "Perform an action from a played card", this.getPlayedActionCards(), (foundCards: Array<ICard>) => {
            const foundCard = foundCards[0];
            foundCard.action!(this, game)
                .then(() => {
                    this.takeAction(game);
                })
                .catch((err: string) => {
                    console.warn("Error taking action from card", err);
                    this.takeAction(game); 
                })
        }));

        /* 
            // If you have cards to sell
            new SelectOption("Sell Patents"),

            // If you have 11 mega credits
            new SelectOption("Power Plant"),

            // If you have money and temperature not max
            new SelectOption("Asteroid"),

            // If you have money
            new SelectOption("Greenery"),
            new SelectOption("City"),

            // If there are still milestones to purchase
            new SelectOption("Purchase Milestone"),

            // If there are still awards to fund
            new SelectOption("Fund Award")
        */
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

