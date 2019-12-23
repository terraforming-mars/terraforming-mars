
import { expect } from "chai";
import { AlliedBanks } from "../../../src/cards/prelude/AlliedBanks";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("AlliedBanks", function () {
    it("Should play", function () {
        const card = new AlliedBanks();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(3);
        expect(player.megaCreditProduction).to.eq(4);
    });
});
