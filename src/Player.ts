
import { Card } from "./Card";
import { CorporationCard } from "./CorporationCard";

const utilities = require("./utilities");

export class Player {

    // Hash used to identify and authenticate player
    public hash: string = utilities.generateUUID();

    public corporationCardsDealt: Array<CorporationCard> = [];
    public corporationCard: CorporationCard | undefined = undefined;

    public megaCredits: number = 0;
    public steel: number = 0;
    public energy: number = 0;
    public steelProduction: number = 0;
    public energyProduction: number = 0;
    public heat: number = 0;
    public heatProduction: number = 0;
    public plants: number = 0;
    public plantProduction: number = 0;
    public cardsDealt: Array<Card> = [];
    public cardsInHand: Array<Card> = [];
    public color: string | undefined;
    public terraformRating: number = 20;
}

