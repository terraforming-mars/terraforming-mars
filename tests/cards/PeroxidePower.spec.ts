
import { expect } from "chai";
import { PeroxidePower } from "../../src/cards/PeroxidePower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";

describe("PeroxidePower", function () {
    it("Should play", function () {
        const card = new PeroxidePower();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    });
});
