import { expect } from "chai";
import { Meltworks } from "../../../src/cards/promo/Meltworks";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Meltworks", function () {
    it("Can't act", function () {
        const card = new Meltworks();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should act", function () {
        const card = new Meltworks();
        const player = new Player("test", Color.BLUE, false);
        player.heat = 5;
        expect(card.canAct(player)).to.eq(true);
        card.action(player);
        expect(player.heat).to.eq(0);
        expect(player.steel).to.eq(3);
    });
});
