
import { expect } from "chai";
import { Sponsors } from "../../src/cards/Sponsors";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";

describe("Sponsors", function () {
    it("Should play", function () {
        const card = new Sponsors();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});
