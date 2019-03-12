
import { expect } from "chai";
import { MethaneFromTitan } from "../../src/cards/MethaneFromTitan";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("MethaneFromTitan", function () {
    it("Should throw", function () {
        const card = new MethaneFromTitan();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 2% oxygen");
    });
    it("Should play", function () {
        const card = new MethaneFromTitan();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.heatProduction).to.eq(2);
        expect(player.plantProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(2);
    });
});
