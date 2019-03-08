
import { expect } from "chai";
import { IceCapMelting } from "../../src/cards/IceCapMelting";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("IceCapMelting", function () {
    it("Should throw", function () {
        const card = new IceCapMelting();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("not warm enough, must be +2C or warmer");
    });
    it("Should play", function () {
        const card = new IceCapMelting();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 3); //  -6
        game.increaseTemperature(player, 3); //   0
        game.increaseTemperature(player, 1); //   2
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
    });
});
