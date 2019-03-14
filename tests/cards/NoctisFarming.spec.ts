
import { expect } from "chai";
import { NoctisFarming } from "../../src/cards/NoctisFarming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("NoctisFarming", function () {
    it("Should throw", function () {
        const card = new NoctisFarming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires -20C or warmer");
    });
    it("Should play", function () {
        const card = new NoctisFarming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 2); // -20
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.plants).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
    });
});
