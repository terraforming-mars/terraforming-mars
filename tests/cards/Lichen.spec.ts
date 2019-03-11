
import { expect } from "chai";
import { Lichen } from "../../src/cards/Lichen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Lichen", function () {
    it("Should throw", function () {
        const card = new Lichen();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires -24C or warmer");
    });
    it("Should play", function () {
        const card = new Lichen();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(1);
    });
});
