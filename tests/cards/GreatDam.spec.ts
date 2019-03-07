
import { expect } from "chai";
import { GreatDam } from "../../src/cards/GreatDam";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GreatDam", function () {
    it("Should throw", function () {
        const card = new GreatDam();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 4 ocean tiles");
    });
    it("Should play", function () {
        const card = new GreatDam();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        while (game.getOceansOnBoard() < 4) {
            game.addOceanTile(player, game.getAvailableSpacesForOcean(player)[0].id);
        }
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
    });
});
