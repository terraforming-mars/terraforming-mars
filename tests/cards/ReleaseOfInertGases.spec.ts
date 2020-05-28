
import { expect } from "chai";
import { ReleaseOfInertGases } from "../../src/cards/ReleaseOfInertGases";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ReleaseOfInertGases", function () {
    it("Should play", function () {
        const card = new ReleaseOfInertGases();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getTerraformRating()).to.eq(22);
    });
});
