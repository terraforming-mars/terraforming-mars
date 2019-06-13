
import { expect } from "chai";
import { Pets } from "../../src/cards/Pets";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Pets", function () {
    it("Should throw", function () {
        const card = new Pets();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        expect(function () { player.removeAnimals(player, card, 5); }).to.throw("Animals may not be removed from pets");
    });
    it("Should play", function () {
        const card = new Pets();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        card.animals = 4;
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(2);
        player.playedCards.push(card);
        game.addCityTile(player, game.getAvailableSpacesOnLand(player)[0].id);
        expect(card.animals).to.eq(5);
    });
});
