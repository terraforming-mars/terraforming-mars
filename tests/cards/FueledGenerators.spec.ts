
import { expect } from "chai";
import { FueledGenerators } from "../../src/cards/FueledGenerators";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("FueledGenerators", function () {
    it("Should play", function () {
        const card = new FueledGenerators();
        const player = new Player("test", Color.BLUE, false);
        player.plantProduction = 1;
        card.play(player);
        expect(player.megaCreditProduction).to.eq(-1);
        expect(player.energyProduction).to.eq(1);
    });
});
