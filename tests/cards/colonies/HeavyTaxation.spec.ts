import { expect } from "chai";
import { HeavyTaxation } from "../../../src/cards/colonies/HeavyTaxation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("HeavyTaxation", function () {
    it("Should play", function () {
        const card = new HeavyTaxation();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).is.not.true;
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        expect(player.megaCredits).to.eq(4);
    });
});