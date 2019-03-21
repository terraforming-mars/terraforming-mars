
import { expect } from "chai";
import { Zeppelins } from "../../src/cards/Zeppelins";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Zeppelins", function () {
    it("Should throw", function () {
        const card = new Zeppelins();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 5% oxygen");
    });
    it("Should play", function () {
        const card = new Zeppelins();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 1); // 5
        const lands = game.getAvailableSpacesOnLand(player);
        game.addCityTile(player, lands[0].id);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(1);
    });
});
