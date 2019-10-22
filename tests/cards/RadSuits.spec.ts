
import { expect } from "chai";
import { RadSuits } from "../../src/cards/RadSuits";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("RadSuits", function () {
    it("Should throw", function () {
        const card = new RadSuits();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have 2 cities in play");
    });
    it("Should play", function () {
        const card = new RadSuits();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const lands = game.getAvailableSpacesOnLand(player);
        game.addCityTile(player, lands[0].id);
        game.addCityTile(player, lands[1].id);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(1);
    });
});
