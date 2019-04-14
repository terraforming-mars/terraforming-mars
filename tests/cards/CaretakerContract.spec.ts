
import { expect } from "chai";
import { CaretakerContract } from "../../src/cards/CaretakerContract";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("CaretakerContract", function () {
    it("Should throw", function () {
        const card = new CaretakerContract();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 0C or warmer");
        expect(function () { card.action(player, game); }).to.throw("Need 8 heat to spend");
    });
    it("Should play", function () { 
        const card = new CaretakerContract();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 3); //  -6
        game.increaseTemperature(player, 3); //   0
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new CaretakerContract();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.heat = 8;
        card.action(player, game);
        expect(player.heat).to.eq(0);
        expect(player.terraformRating).to.eq(15);
    });
});
