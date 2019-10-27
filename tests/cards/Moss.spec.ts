
import { expect } from "chai";
import { Moss } from "../../src/cards/Moss";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Moss", function () {
    it("Can't play", function () {
        const card = new Moss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        while (game.getOceansOnBoard() < 3) {
            game.addOceanTile(player, game.getAvailableSpacesForOcean(player)[0].id);
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Moss();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(-1);
        expect(player.plantProduction).to.eq(1);
    });
});
