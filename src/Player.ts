
import { IProjectCard } from "./cards/IProjectCard";
import { CorporationCard } from "./CorporationCard";
import { CardDiscount } from "./CardDiscount";
import { Tags } from "./cards/Tags";

const utilities = require("./utilities");

export class Player {

    // Hash used to identify and authenticate player
    public hash: string = utilities.generateUUID();

    public corporationCardsDealt: Array<CorporationCard> = [];
    public corporationCard: CorporationCard | undefined = undefined;

    public megaCredits: number = 0;
    public steel: number = 0;
    public titanium: number = 0;
    public energy: number = 0;
    public steelProduction: number = 0;
    public energyProduction: number = 0;
    public heat: number = 0;
    public heatProduction: number = 0;
    public onCardSelected: Function | undefined;
    public waitingFor: string | undefined;
    public plants: number = 0;
    public plantProduction: number = 0;
    public cardsDealt: Array<IProjectCard> = [];
    public cardsInHand: Array<IProjectCard> = [];
    public color: string | undefined;
    private cardDiscounts: Array<CardDiscount> = [];
    public terraformRating: number = 20;
    public victoryPoints: number = 0;
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
    public getTagCount(tag: Tags): number {
        let tagCount = 0;
        this.cardsInHand.forEach((card: IProjectCard) => {
            tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
        });
        tagCount += this.corporationCard.tags.filter((cardTag) => cardTag === tag).length;
        return tagCount;
    }
}

