
import { expect } from "chai";
import { Sponsors } from "../../src/cards/Sponsors";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Sponsors", function () {
    it("Should play", function () {
        const card = new Sponsors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(2);
    });
});
