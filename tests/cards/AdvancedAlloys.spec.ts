
import { expect } from "chai";
import { AdvancedAlloys } from "../../src/cards/AdvancedAlloys";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("AdvancedAlloys", function () {
    it("Should play", function () {
        const card = new AdvancedAlloys();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.titaniumValue).to.eq(4);
        expect(player.steelValue).to.eq(3);
    });
});
