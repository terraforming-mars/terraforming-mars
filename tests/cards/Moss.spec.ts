
import { expect } from "chai";
import { Moss } from "../../src/cards/Moss";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Moss", function () {
    it("Should throw", function () {
        const card = new Moss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 3 ocean tiles");
        while (game.getOceansOnBoard() < 3) {
            game.addOceanTile(player, game.getAvailableSpacesForOcean(player)[0].id);
        }
        expect(function () { card.play(player, game); }).to.throw("Must have a plant to lose");
    });
    it("Should play", function () {
        const card = new Moss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        while (game.getOceansOnBoard() < 3) {
            game.addOceanTile(player, game.getAvailableSpacesForOcean(player)[0].id);
        }
        player.plants = 1;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(0);
        expect(player.plantProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(-1);
    });
});
