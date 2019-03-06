
import { expect } from "chai";
import { Farming } from "../../src/cards/Farming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Farming", function () {
    it("Should throw", function () {
        const card = new Farming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires +4C or warmer");
    });
    it("Should play", function () {
        const card = new Farming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 3); //  -6
        game.increaseTemperature(player, 3); //   0
        game.increaseTemperature(player, 2); //   4
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.plantProduction).to.eq(2);
        expect(player.plants).to.eq(2);
    });
});
