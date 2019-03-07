
import { expect } from "chai";
import { Grass } from "../../src/cards/Grass";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Grass", function () {
    it("Should throw", function () {
        const card = new Grass();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires -16C or warmer");
    });
    it("Should play", function () {
        const card = new Grass();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 1); // -16
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(1);
        expect(player.plants).to.eq(3);
    });
});
