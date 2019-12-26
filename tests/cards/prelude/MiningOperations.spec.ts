
import { expect } from "chai";
import { MiningOperations } from "../../../src/cards/prelude/MiningOperations";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("MiningOperations", function () {
    it("Should play", function () {
        const card = new MiningOperations();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.steelProduction).to.eq(2);
        expect(player.steel).to.eq(4);
    });
});
