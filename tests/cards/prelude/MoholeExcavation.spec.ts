
import { expect } from "chai";
import { MoholeExcavation } from "../../../src/cards/prelude/MoholeExcavation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("MoholeExcavation", function () {
    it("Should play", function () {
        const card = new MoholeExcavation();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.heatProduction).to.eq(2);
        expect(player.heat).to.eq(2);
        expect(player.steelProduction).to.eq(1);
    });
});
