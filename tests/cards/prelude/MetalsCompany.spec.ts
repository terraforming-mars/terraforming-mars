
import { expect } from "chai";
import { MetalsCompany } from "../../../src/cards/prelude/MetalsCompany";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("MetalsCompany", function () {
    it("Should play", function () {
        const card = new MetalsCompany();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(1);
        expect(player.steelProduction).to.eq(1);
        expect(player.megaCreditProduction).to.eq(1);
    });
});
