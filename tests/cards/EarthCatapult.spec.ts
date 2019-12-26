
import { expect } from "chai";
import { EarthCatapult } from "../../src/cards/EarthCatapult";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("EarthCatapult", function () {
    it("Should play", function () {
        const card = new EarthCatapult();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
        expect(card.getCardDiscount()).to.eq(2);
    });
});

