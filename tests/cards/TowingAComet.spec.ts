
import { expect } from "chai";
import { TowingAComet } from "../../src/cards/TowingAComet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TowingAComet", function () {
    it("Should play", function () {
        const card = new TowingAComet();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
        expect(player.plants).to.eq(2);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
