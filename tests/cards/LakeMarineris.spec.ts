
import { expect } from "chai";
import { LakeMarineris } from "../../src/cards/LakeMarineris";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("LakeMarineris", function () {
    it("Should throw", function () {
        const card = new LakeMarineris();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 0C or warmer");
    });
    it("Should play", function () {
        const card = new LakeMarineris();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 3); // - 6
        game.increaseTemperature(player, 3); //   0
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb();
        expect(player.victoryPoints).to.eq(2);
        action.options[0].cb(game.getAvailableSpacesForOcean(player)[0]);
        action.options[1].cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(2);
    });
});
