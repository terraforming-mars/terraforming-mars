
import { expect } from "chai";
import { Heather } from "../../src/cards/Heather";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Heather", function () {
    it("Should throw", function () {
        const card = new Heather();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires -14C or warmer");
    });
    it("Should play", function () {
        const card = new Heather();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(1);
        expect(player.plants).to.eq(1);
    });
});
