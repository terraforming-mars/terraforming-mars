
import { expect } from "chai";
import { PermafrostExtraction } from "../../src/cards/PermafrostExtraction";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PermafrostExtraction", function () {
    it("Should throw", function () {
        const card = new PermafrostExtraction();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Temperature must be -8C or warmer");
    });
    it("Should play", function () {
        const card = new PermafrostExtraction();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 2); // - 8
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
    });
});
