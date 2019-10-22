
import { expect } from "chai";
import { AcquiredCompany } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AcquiredCompany", function () {
    it("Should play", function () {
        const card = new AcquiredCompany();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play(player, game);
        expect(player.megaCreditProduction).to.eq(3);
    });
});
