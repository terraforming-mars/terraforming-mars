
import { expect } from "chai";
import { GiantIceAsteroid } from "../../src/cards/GiantIceAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GiantIceAsteroid", function () {
    it("Should play", function () {
        const card = new GiantIceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);

        const action = card.play(player, game);
        expect(action).eq(undefined);
        expect(game.getTemperature()).to.eq(-26);
    });
});

