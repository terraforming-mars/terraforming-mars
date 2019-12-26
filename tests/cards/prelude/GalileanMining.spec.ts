
import { expect } from "chai";
import { GalileanMining } from "../../../src/cards/prelude/GalileanMining";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("GalileanMining", function () {
    it("Can play", function () {
        const card = new GalileanMining();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        player.megaCredits = 5;
        expect(card.canPlay(player)).to.eq(true);
    });
    it("Should play", function () {
        const card = new GalileanMining();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(-5);
        expect(player.titaniumProduction).to.eq(2);
    });
});
