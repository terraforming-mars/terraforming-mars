
import { expect } from "chai";
import { IceAsteroid } from "../../src/cards/IceAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("IceAsteroid", function () {
    it("Should play", function () {
        const card = new IceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action.options.length).to.eq(2);
        action.options[0].cb(game.getAvailableSpacesForOcean(player)[0]);
        action.options[1].cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(2);
        expect(action.cb()).to.eq(undefined);
    });
});
