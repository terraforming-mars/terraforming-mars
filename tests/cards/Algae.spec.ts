
import { expect } from "chai";
import { Algae } from "../../src/cards/Algae";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("Algae", function () {
    it("Should throw without oceans", function () {
        const card = new Algae();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 5 ocean tiles");
    });
    it("Should play", function () {
        const card = new Algae();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const oceanSpaces = game.getAvailableSpacesForOcean(player);
        for (var i = 0; i < 5; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        card.play(player, game);
        expect(player.plants).to.eq(1);
        expect(player.plantProduction).to.eq(2);
    });
});
