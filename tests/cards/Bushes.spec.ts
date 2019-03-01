
import { expect } from "chai";
import { Bushes } from "../../src/cards/Bushes";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Bushes", function () {
    it("Should throw", function () {
        const card = new Bushes();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires -10C or warmer.");
    });
    it("Should play", function () {
        const card = new Bushes();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 1); // -10
        card.play(player, game);
        expect(player.plantProduction).to.eq(2);
        expect(player.plants).to.eq(2);
    });
});
