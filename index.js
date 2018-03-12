
var Game = require("./src/Game");

var game = new Game("blue");
game.allPlayersAdded();
game.selectCorporationCard(game.players[0].hash, "Beginner Corporation");

