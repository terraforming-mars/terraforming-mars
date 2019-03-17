
import { expect } from "chai";
import { RoverConstruction } from "../../src/cards/RoverConstruction";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("RoverConstruction", function () {
    it("Should play", function () {
        const card = new RoverConstruction();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        game.addCityTile(player, game.getAvailableSpacesOnLand(player)[0].id);
        expect(game.getCitiesInPlay()).to.eq(1);
        expect(player.megaCredits).to.eq(2); 
    });
});
