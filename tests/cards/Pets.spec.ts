
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
        expect(function () { player.removeAnimals(card, 5); }).to.throw("Animals may not be removed from pets");
    });
    it("Should play", function () {
        const card = new Pets();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.onGameEnd.length).to.eq(1);
        card.animals = 4;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(2);
        game.addCityTile(player, game.getAvailableSpacesOnLand(player)[0].id);
        expect(card.animals).to.eq(5);
    });
});
