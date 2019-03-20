
import { expect } from "chai";
import { TundraFarming } from "../../src/cards/TundraFarming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TundraFarming", function () {
    it("Should throw", function () {
        const card = new TundraFarming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires -6C or warmer");
    });
    it("Should play", function () {
        const card = new TundraFarming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 3); // - 6
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(1);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.plants).to.eq(1);
        expect(player.victoryPoints).to.eq(2);
    });
});
