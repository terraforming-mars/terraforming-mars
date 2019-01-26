
import { IProjectCard } from "./cards/IProjectCard";
import { CorporationCard } from "./cards/corporation/CorporationCard";
import { CardDiscount } from "./CardDiscount";
import { Tags } from "./cards/Tags";
import { PlayerInput } from "./PlayerInput";
import { CardType } from "./cards/CardType";
import { Color } from "./Color";

export class Player {
    constructor(public name: string, public color: Color, public beginner: boolean) {

    }

    public corporationCardsDealt: Array<CorporationCard> = [];
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

    private waitingFor?: Array<PlayerInput>;

    public setWaitingFor(input: Array<PlayerInput> | PlayerInput | undefined, _inputHandler?: Function): void {
        if (input === undefined) {
            this.waitingFor = undefined;
            return;
        }
        if (this.waitingFor !== undefined) {
            throw "Already waiting on input from player";
        }
        if (!Array.isArray(input)) {
            this.waitingFor = [input];
        } else {
            this.waitingFor = input;
        }
    }

}

