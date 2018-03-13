
var CARDS = require("../data/cards.json");
var CORPORATION_CARDS = require("../data/corporationCards.json");
var utilities = require("./utilities");
var Player = require("./Player");

function Game(initialPlayerColor) {
    this.hash = utilities.generateUUID();
    this.cards = utilities.shuffle(CARDS);
    this.corporationCards = utilities.shuffle(CORPORATION_CARDS);

    this.beginnerCard = utilities.findBeginnerCard(this.corporationCards);

    this.addingPlayers = true;
    this.pickingCorporation = false;
    this.initialCardSelection = false;

    this.firstPlayerIndex = 0;

    this.phase = "research";

    this.players = [
        new Player(initialPlayerColor)
    ];

    console.log("Starting game " + this.hash + " with player", this.players[0]);
}

Game.prototype.getPlayer = function(playerHash) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].hash === playerHash) {
            return this.players[i];
        }
    }
}

Game.prototype.checkForAllCorporationsAdded = function() {
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
}

Game.prototype.drawCards = function(num) {
    if (num <= this.cards.length) {
        return this.cards.splice(0, num);
    }
    throw "No more cards to deal";
}

Game.prototype.selectCorporationCard = function(playerHash, cardName) {
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

Game.prototype.allPlayersAdded = function() {
    console.log("All Players Added");
    console.log("Dealing Corporation Cards");

    this.firstPlayerIndex = Math.floor(Math.random(this.players.length));

    console.log("Player " + this.firstPlayerIndex + " goes first");

    for (var i = 0; i < this.players.length; i++) {
        // Give two cards to each player
        this.players[i].setAvailableCorporationCards([this.beginnerCard].concat(this.corporationCards.splice(0, 2)));
    }
    this.addingPlayer = false;
    this.pickingCorporation = true;
}

Game.prototype.addPlayer = function(player) {
    console.log("Adding player", player);
    this.players.push(player);
}

Game.prototype.payForCard = function(playerHash, cardName) {
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

Game.prototype.readyToStartGame = function(playerHash) {
    var player = this.getPlayer(playerHash);
    if (player) {
        player.readyToStartGame();
    } else {
        throw "Unable to find player " + playerHash;
    }
}

module.exports = Game;

