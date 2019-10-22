
import { expect } from "chai";
import { GiantIceAsteroid } from "../../src/cards/GiantIceAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";

describe("GiantIceAsteroid", function () {
    it("Should play", function () {
        const card = new GiantIceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof AndOptions).to.eq(true);
        player.plants = 6;
        action.options[0].cb(player);
        expect(player.plants).to.eq(0);
        action.options[1].cb(game.getAvailableSpacesForOcean(player)[0]);
        action.options[2].cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(2);
        action.cb();
        expect(game.getTemperature()).to.eq(-26);
    });
});
