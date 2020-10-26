
import { expect } from "chai";
import { LandClaim } from "../../src/cards/LandClaim";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("LandClaim", function () {
    it("Should play", function () {
        const card = new LandClaim();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).is.not.undefined;
        const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
        action.cb(landSpace);
        expect(landSpace.player).to.eq(player);
        expect(landSpace.tile).is.undefined;
    });
});
