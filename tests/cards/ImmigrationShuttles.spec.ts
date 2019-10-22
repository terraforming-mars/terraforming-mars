
import { expect } from "chai";
import { ImmigrationShuttles } from "../../src/cards/ImmigrationShuttles";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ImmigrationShuttles", function () {
    it("Should play", function () {
        const card = new ImmigrationShuttles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(5);
        for (var i = 0; i < 5; i++) {
            game.addCityTile(player, game.getAvailableSpacesOnLand(player)[0].id);
        }
        expect(game.getCitiesInPlay()).to.eq(5);
        card.onGameEnd(player, game);
        expect(player.victoryPoints).to.eq(1);
    });
});
