
import { expect } from "chai";
import { WavePower } from "../../src/cards/WavePower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("WavePower", function () {
    it("Should throw", function () {
        const card = new WavePower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 3 ocean tiles");
    });
    it("Should play", function () {
        const card = new WavePower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const oceans = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 3; i++) {
            game.addOceanTile(player, oceans[i].id);
        }
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(1);
    });
});
