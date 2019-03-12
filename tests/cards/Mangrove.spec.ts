
import { expect } from "chai";
import { Mangrove } from "../../src/cards/Mangrove";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("Mangrove", function () {
    it("Should throw", function () {
        const card = new Mangrove();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires +4C or warmer");
    });
    it("Should play", function () {
        const card = new Mangrove();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 3); // - 6
        game.increaseTemperature(player, 3); //   0
        game.increaseTemperature(player, 2); //   4
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
        expect(action.availableSpaces[0].player).to.eq(player);
    });
});
