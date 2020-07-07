import { expect } from "chai";
import { SecurityFleet } from "../../src/cards/SecurityFleet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("SecurityFleet", function () {
    let card : SecurityFleet, player : Player;

    beforeEach(function() {
        card = new SecurityFleet();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't act if no titanium", function () {
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        player.titanium = 1;
        expect(card.canAct(player)).to.eq(true);

        card.action(player);
        expect(player.titanium).to.eq(0);
        expect(card.resourceCount).to.eq(1);
    });
});
