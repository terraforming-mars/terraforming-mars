
import { expect } from "chai";
import { GHGProducingBacteria } from "../../src/cards/GHGProducingBacteria";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("GHGProducingBacteria", function () {
    it("Should throw", function () {
        const card = new GHGProducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 4% oxygen");
    });
    it("Should play", function () {
        const card = new GHGProducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new GHGProducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        let action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.microbes).to.eq(1);
        action = card.action(player, game);
        expect(card.microbes).to.eq(2);
        const orAction = card.action(player, game) as OrOptions;
        expect(orAction).not.to.eq(undefined);
        expect(orAction instanceof OrOptions).to.eq(true);
    });
});
