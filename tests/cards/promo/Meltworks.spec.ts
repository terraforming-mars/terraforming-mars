import { expect } from "chai";
import { Meltworks } from "../../../src/cards/promo/Meltworks";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Meltworks", function () {
    let card : Meltworks, player : Player;

    beforeEach(function() {
        card = new Meltworks();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't act", function () {
        player.heat = 4;
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.heat = 5;
        expect(card.canAct(player)).to.eq(true);
        
        card.action(player);
        expect(player.heat).to.eq(0);
        expect(player.steel).to.eq(3);
    });
});
