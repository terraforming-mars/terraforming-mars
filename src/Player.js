
var utilities = require("./utilities");

function Player(color) {
    // Hash used to identify and authenticate player
    this.hash = utilities.generateUUID();
    // Color selected for player
    this.color = color;
    this.corporationCard = undefined;
    this.megaCredits = 0;
    this.steel = 0;
    this.energy = 0;
    this.steelProduction = 1;
    this.energyProduction = 1;
    this.heat = 1;
    this.heatProduction = 1;
    this.plants = 1;
    this.plantProduction = 1;
}

Player.prototype.setAvailableCorporationCards = function(corporationCards) {
    console.log("Player(" + this.hash + "):setAvailableCorporationCards", corporationCards.map(function(c) { return c.name;}));
    this.availableCorporationCards = corporationCards;
}

Player.prototype.setInitialCards = function(initialCards) {
    console.log("Player(" + this.hash + "):initialCards", initialCards.map(function(c) { return c.name;}));
    this.initialCards = initialCards;
}

Player.prototype.setCorporationCard = function(corporationCardName) {
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

module.exports = Player;

