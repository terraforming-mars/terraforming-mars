
import { expect } from "chai";
import { IceAsteroid } from "../../src/cards/IceAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("IceAsteroid", function () {
    it("Should play", function () {
        const card = new IceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        const subAction = action!.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(subAction).not.to.eq(undefined);
        expect(game.getOceansOnBoard()).to.eq(1);
        subAction!.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(2);
    });
});
