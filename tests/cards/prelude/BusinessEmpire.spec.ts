
import { expect } from "chai";
import { BusinessEmpire } from "../../../src/cards/prelude/BusinessEmpire";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("BusinessEmpire", function () {
    it("Can play", function () {
        const card = new BusinessEmpire();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        player.megaCredits = 6;
        expect(card.canPlay(player)).to.eq(true);
    });
    it("Should play", function () {
        const card = new BusinessEmpire();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(-6);
        expect(player.megaCreditProduction).to.eq(6);
    });
});
