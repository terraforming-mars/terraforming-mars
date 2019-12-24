
import { expect } from "chai";
import { DomeFarming } from "../../../src/cards/prelude/DomeFarming";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("DomeFarming", function () {
    it("Should play", function () {
        const card = new DomeFarming();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(1);
        expect(player.megaCreditProduction).to.eq(2);
    });
});
