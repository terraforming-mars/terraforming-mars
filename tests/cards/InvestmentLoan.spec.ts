
import { expect } from "chai";
import { InvestmentLoan } from "../../src/cards/InvestmentLoan";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("InvestmentLoan", function () {
    it("Should play", function () {
        const card = new InvestmentLoan();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(-1);
        expect(player.megaCredits).to.eq(10);
    });
});
