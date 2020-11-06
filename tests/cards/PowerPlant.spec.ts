
import { expect } from "chai";
import { PowerPlant } from "../../src/cards/PowerPlant";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";

describe("PowerPlant", function () {
    it("Should play", function () {
        const card = new PowerPlant();
        const player = new Player("test", Color.BLUE, false);
        expect(card.play(player)).is.undefined;
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    });
});
