
import { expect } from "chai";
import { DustSeals } from "../../src/cards/DustSeals";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("DustSeals", function () {
    it("Should throw", function () {
        const card = new DustSeals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const oceanSpaces = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 4; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        expect(function () { card.play(player, game); }).to.throw("Requires 3 or less ocean tiles");
    });
    it("Should play", function () {
        const card = new DustSeals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
    });
});

