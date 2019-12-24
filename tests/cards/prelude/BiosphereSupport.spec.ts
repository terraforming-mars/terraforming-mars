
import { expect } from "chai";
import { BiosphereSupport } from "../../../src/cards/prelude/BiosphereSupport";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("BiosphereSupport", function () {
    it("Can play", function () {
        const card = new BiosphereSupport();
        const player = new Player("test", Color.BLUE, false);
        const action = card.canPlay(player);
        expect(action).to.eq(true);
        player.megaCreditProduction = -5;
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new BiosphereSupport();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(2);
        expect(player.megaCreditProduction).to.eq(-1);
    });
});
