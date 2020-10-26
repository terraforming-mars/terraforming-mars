
import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SupplyDrop } from "../../../src/cards/prelude/SupplyDrop";

describe("SupplyDrop", function () {
    it("Should play", function () {
        const player = new Player("foo", Color.BLUE, false);
        const card = new SupplyDrop();
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.steel).to.eq(8);
        expect(player.titanium).to.eq(3);
        expect(player.plants).to.eq(3);
    });
});
