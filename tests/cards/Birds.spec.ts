
import { expect } from "chai";
import { Birds } from "../../src/cards/Birds";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Birds", function () {
    it("Should throw", function () {
        const card = new Birds();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 13% oxygen");
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        game.increaseOxygenLevel(player, 2); // 8
        game.increaseOxygenLevel(player, 2); // 10
        game.increaseOxygenLevel(player, 2); // 12
        game.increaseOxygenLevel(player, 1); // 13
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer).to.eq(true);
        expect(function () { action.cb(player); }).to.throw("Player needs at least 2 plant production");
    });
});
