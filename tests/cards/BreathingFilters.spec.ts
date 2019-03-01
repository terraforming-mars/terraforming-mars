
import { expect } from "chai";
import { BreathingFilters } from "../../src/cards/BreathingFilters";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("BreathingFilters", function () {
    it("Should throw", function () {
        const card = new BreathingFilters();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 7% oxygen");
    });
    it("Should play", function () {
        const card = new BreathingFilters();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        game.increaseOxygenLevel(player, 1); // 7
        card.play(player, game);
        expect(player.victoryPoints).to.eq(2);
    });
});
