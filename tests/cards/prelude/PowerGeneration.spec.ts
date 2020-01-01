
import { expect } from "chai";
import { PowerGeneration } from "../../../src/cards/prelude/PowerGeneration";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("PowerGeneration", function () {
    it("Should play", function () {
        const card = new PowerGeneration();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(3);
    });
});
