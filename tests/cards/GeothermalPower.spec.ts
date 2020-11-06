
import { expect } from "chai";
import { GeothermalPower } from "../../src/cards/GeothermalPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";

describe("GeothermalPower", function () {
    it("Should play", function () {
        const card = new GeothermalPower();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    });
});
