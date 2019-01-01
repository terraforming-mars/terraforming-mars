
import { Card } from "./Card";
import { CorporationCard } from "./CorporationCard";

var utilities = require("./utilities");

export class Player {

    // Hash used to identify and authenticate player
    private hash: string = utilities.generateUUID();

    private availableCorporationCards: Array<CorporationCard> = [];
    private corporationCard: CorporationCard | undefined = undefined;

    private megaCredits: number = 0;
    private steel: number = 0;
    private energy: number = 0;
    private steelProduction: number = 0;
    private energyProduction: number = 0;
    private heat: number = 0;
    private heatProduction: number = 0;
    private plants: number = 0;
    private plantProduction: number = 0;
    private readyToStartGame: boolean = false;
    private selectableCards: Array<Card> = [];
    private cards: Array<Card> = [];

    constructor(private color: string) {
    }

    public setAvailableCorporationCards(corporationCards: Array<CorporationCard>): void {
        console.log("Player(" + this.hash + "):setAvailableCorporationCards", corporationCards.map(function(c: CorporationCard) { return c.name;}));
        this.availableCorporationCards = corporationCards;
    }

    public canPay(mc: number): boolean {
        return this.megaCredits >= mc;
    }

    public pay(mc: number): void {
        this.megaCredits -= mc;
    }

    public getCard(cardName: string): void {
        for (var i = 0; i < this.selectableCards.length; i++) {
            if (this.selectableCards[i].name === cardName) {
                this.cards.push(this.selectableCards.splice(i, 1)[0]);
                return;
            }
        }
    }

    public setReadyToStartGame(): void {
        this.readyToStartGame = true;
        this.selectableCards = [];
    }

    public dealCards(cards: Array<Card>): void {
        console.log("Player(" + this.hash + "):dealCards", cards.map(function(c: Card) { return c.name;}));
        this.selectableCards = cards;
    }

    public setCorporationCard(corporationCardName: string): void {
        for (var i = 0; i < this.availableCorporationCards.length; i++) {
            if (this.availableCorporationCards[i].name === corporationCardName) {
                this.corporationCard = this.availableCorporationCards[i];
                this.megaCredits = this.corporationCard.mc;
                console.log("Player(" + this.hash + "):corporationCard =", this.corporationCard.name, "starting mega credits", this.megaCredits);
                return;
            }
        }
        throw "Unable to find requested card";
    }
}

