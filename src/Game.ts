
var CARDS = require("../../data/cards.json");
var CORPORATION_CARDS = require("../../data/corporationCards.json");

import { Card } from "./Card";
import { CorporationCard } from "./CorporationCard";
import * as utilities from "./utilities";
import { Player } from "./Player";

export class Game {
    private hash: string = utilities.generateUUID();
    private cards: Array<Card> = utilities.shuffle<Card>(CARDS);
    private corporationCards: Array<CorporationCard> = utilities.shuffle<CorporationCard>(CORPORATION_CARDS);
    private beginnerCard: CorporationCard;
    private players: Array<Player> = [];
    private pickingCorporation: boolean = false;
    private addingPlayers: boolean = true;
    private initialCardSelection: boolean = false;
    private firstPlayerIndex: number = 0;
    private phase: string = "research";
    constructor(initialPlayerColor: string) {

        this.beginnerCard = utilities.findBeginnerCard(this.corporationCards);

        this.players.push(new Player(initialPlayerColor));

        console.log("Starting game " + this.hash + " with player", this.players[0]);
    }

    public getPlayer(playerHash: string): Player {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].hash === playerHash) {
                return this.players[i];
            }
        }
    }

    public checkForAllCorporationsAdded(): boolean {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].corporationCard === undefined) {
                return false;
            }
        }
        console.log("All corporation cards selected");
        this.pickingCorporation = false;
        this.initialCardSelection = true;
        console.log("Dealing 10 cards to each player");
        var allPlayersReady = true;
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].dealCards(this.drawCards(10));
            if (this.players[i].corporationCard.name === "Beginner Corporation") {
                // Beginner does not pay
                this.players[i].cards = this.players[i].selectableCards;
            }
        }
        return true;
    }

    public drawCards(num: number): Array<Card> {
        if (num <= this.cards.length) {
            return this.cards.splice(0, num);
        }
        throw "No more cards to deal";
    }

    public selectCorporationCard(playerHash: string, cardName: string): void {
        if (this.pickingCorporation !== true) {
            throw "Can not pick cards";
            return;
        }
        var player = this.getPlayer(playerHash);
        if (player) {
            player.setCorporationCard(cardName);
            this.checkForAllCorporationsAdded();
        } else {
            throw "Unable to find player " + playerHash;
        }
    }

    public allPlayersAdded() {
        console.log("All Players Added");
        console.log("Dealing Corporation Cards");

        this.firstPlayerIndex = Math.floor(Math.random() * this.players.length);

        console.log("Player " + this.firstPlayerIndex + " goes first");

        for (var i = 0; i < this.players.length; i++) {
            // Give two cards to each player
            this.players[i].setAvailableCorporationCards([this.beginnerCard].concat(this.corporationCards.splice(0, 2)));
        }
        this.addingPlayers = false;
        this.pickingCorporation = true;
    }

    public addPlayer(player: Player) {
        console.log("Adding player", player);
        this.players.push(player);
    }

    public payForCard(playerHash: string, cardName: string): void {
        var player = this.getPlayer(playerHash);
        if (player) {
            if (player.hasSelectableCard(cardName)) {
                if (player.canPay(3)) {
                    player.getCard(cardName);
                } else {
                    throw "Player " + playerHash + " can not afford to pay for " + cardName;
                }
            } else {
                throw "Player " + playerHash + " does not have card " + cardName;
            }
        } else {
            throw "Unable to find player " + playerHash;
        }
    }

    public readyToStartGame(playerHash: string): void {
        var player = this.getPlayer(playerHash);
        if (player) {
            player.setReadyToStartGame();
        } else {
            throw "Unable to find player " + playerHash;
        }
    }
}

