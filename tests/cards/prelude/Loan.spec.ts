
import { expect } from "chai";
import { Loan } from "../../../src/cards/prelude/Loan";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Loan", function () {
    it("Can't play", function () {
        const card = new Loan();
        const player = new Player("test", Color.BLUE, false);
        player.megaCreditProduction = -4;
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Loan();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(30);
        expect(player.megaCreditProduction).to.eq(-2);
    });
});
