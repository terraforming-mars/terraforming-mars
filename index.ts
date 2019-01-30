
import { Color } from "./src/Color";
import { Game } from "./src/Game";
import { Player } from "./src/Player";
import { AndOptions } from "./src/inputs/AndOptions";
import { SelectCard } from "./src/inputs/SelectCard";
import { ICard } from "./src/cards/ICard";

// trial run for development
const player1 = new Player("A", Color.BLUE, false);
const player2 = new Player("B", Color.GREEN, true);

console.log("Creating new game");
const game = new Game("FA12FE", [player1, player2], player1);

console.log("Players", game.getPlayers());

const player1Waiting = player1.getWaitingFor();

if (player1Waiting === undefined) {
    throw "Player 1 should be picking cards";
}

const player1Cards = player1Waiting;
if (!(player1Cards instanceof AndOptions)) {
    throw "Should be selecting cards";
}

if (!(player1Cards.options[0] instanceof SelectCard)) {
    throw "Selecting corporation cards at index 0";
}

if (!(player1Cards.options[1] instanceof SelectCard)) {
    throw "Selecting project cards at index 1";
}

// Pick initial cards
player1.process([
    (player1Cards.options[0] as SelectCard<ICard>).cards.slice().splice(0, 1).map((c) => c.name),
    (player1Cards.options[1] as SelectCard<ICard>).cards.slice().splice(0, 5).map((c) => c.name)
]);

console.log("Player 1 is", player1.corporationCard, " with ", player1.megaCredits);
console.log("Player 2 is", player2.corporationCard, " with ", player2.megaCredits);

if (player2.getWaitingFor() !== undefined) {
    throw "Player 2 shouldn't be waiting";
}

if (player1.getWaitingFor() !== undefined) {
    throw "Waiting for player 1 to move";
}

