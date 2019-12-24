
import { expect } from "chai";
import { Biofuels } from "../../../src/cards/prelude/Biofuels";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Biofuels", function () {
    it("Should play", function () {
        const card = new Biofuels();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        expect(player.plantProduction).to.eq(1);
        expect(player.plants).to.eq(2);
    });
});
