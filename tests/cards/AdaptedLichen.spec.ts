
import { expect } from "chai";
import { AdaptedLichen } from "../../src/cards/AdaptedLichen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("AdaptedLichen", function () {
    it("Should play", function () {
        const card = new AdaptedLichen();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.plantProduction).to.eq(1);
    });
});
