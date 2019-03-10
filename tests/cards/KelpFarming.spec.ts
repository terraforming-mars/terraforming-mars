
import { expect } from "chai";
import { KelpFarming } from "../../src/cards/KelpFarming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("KelpFarming", function () {
    it("Should throw", function () {
        const card = new KelpFarming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 6 ocean tiles");
    });
    it("Should play", function () {
        const card = new KelpFarming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        for (var i = 0; i < 6; i++) {
            game.addOceanTile(player, game.getAvailableSpacesForOcean(player)[0].id);
        }
        expect(game.getOceansOnBoard()).to.eq(6);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.plantProduction).to.eq(3);
        expect(player.plants).to.eq(6);
        expect(player.victoryPoints).to.eq(1);
    });
});
