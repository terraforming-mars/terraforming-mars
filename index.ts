
import { Color } from "./src/Color";
import { Game } from "./src/Game";
import { Player } from "./src/Player";

// trial run for development
const player1 = new Player("A", Color.BLUE, false);
const player2 = new Player("B", Color.GREEN, true);

console.log("Creating new game");
const game = new Game("FA12FE", [player1, player2], player1);

console.log("Player 1 corporations", player1.corporationCardsDealt);
console.log("Player 2 corporations", player2.corporationCardsDealt);

const player1Waiting = player1.getWaitingFor();

if (player1Waiting === undefined) {
    throw "Player 1 should be picking cards";
}

console.log("Player 1 is waiting for", player1.getWaitingFor());
console.log("Player 2 is waiting for", player2.getWaitingFor());

const player1Cards = player1Waiting[0];
if (player1Cards === undefined) {
    throw "Player 1 didn't get cards";
}

// Pick initial cards
player1.selectCards(player1Cards.cards.splice(0, 5));

