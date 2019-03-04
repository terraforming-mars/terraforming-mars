
import { expect } from "chai";
import { DomedCrater } from "../../src/cards/DomedCrater";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";

describe("DomedCrater", function () {
    it("Should throw", function () {
        const card = new DomedCrater();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Need energy production");
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        game.increaseOxygenLevel(player, 2); // 8
        expect(function () { card.play(player, game); }).to.throw("Oxygen must be 7% or less");
    });
    it("Should play", function () {
        const card = new DomedCrater();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
        expect(player.plants).to.eq(3);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(3);
        expect(player.victoryPoints).to.eq(1);
    });
});

