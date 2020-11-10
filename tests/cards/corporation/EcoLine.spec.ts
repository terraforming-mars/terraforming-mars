
import { expect } from "chai";
import { EcoLine } from "../../../src/cards/corporation/EcoLine";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("EcoLine", function () {
    it("Should play", function () {
        const card = new EcoLine();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.plants).to.eq(3);
        expect(player.plantsNeededForGreenery).to.eq(7);
    });
});
