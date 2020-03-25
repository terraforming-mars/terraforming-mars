import { expect } from "chai";
import { BigAsteroid } from "../../src/cards/BigAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("BigAsteroid", function () {
    it("Should play", function () {
        const card = new BigAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play(player, game);
        expect(game.getTemperature()).to.eq(-26);
        expect(player.titanium).to.eq(4);
    });
});
