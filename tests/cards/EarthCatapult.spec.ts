
import { expect } from "chai";
import { EarthCatapult } from "../../src/cards/EarthCatapult";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("EarthCatapult", function () {
    it("Should play", function () {
        const card = new EarthCatapult();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(2);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](card)).to.eq(2);
    });
});

