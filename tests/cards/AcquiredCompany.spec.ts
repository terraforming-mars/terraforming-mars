
import { expect } from "chai";
import { AcquiredCompany } from "../../src/cards/AcquiredCompany";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";

describe("AcquiredCompany", function () {
    it("Should play", function () {
        const card = new AcquiredCompany();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    });
});
