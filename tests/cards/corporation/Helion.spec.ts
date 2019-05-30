
import { expect } from "chai";
import { Helion } from "../../../src/cards/corporation/Helion";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Helion", function () {
    it("Should play", function () {
        const card = new Helion();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.heatProduction).to.eq(3);
        expect(player.canUseHeatAsMegaCredits).to.eq(true);
    });
});
