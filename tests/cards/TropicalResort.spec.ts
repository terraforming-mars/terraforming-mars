
import { expect } from "chai";
import { TropicalResort } from "../../src/cards/TropicalResort";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TropicalResort", function () {
    it("Should throw", function () {
        const card = new TropicalResort();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have 2 heat production");
    });
    it("Should play", function () {
        const card = new TropicalResort();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.heatProduction = 2;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.heatProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(3);
        expect(player.victoryPoints).to.eq(2);
    });
});
