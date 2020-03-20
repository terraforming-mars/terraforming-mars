
import { expect } from "chai";
import { BribedCommitte } from "../../src/cards/BribedCommitte";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("BribedCommitte", function () {
    it("Should play", function () {
        const card = new BribedCommitte();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
        expect(player.terraformRating).to.eq(22);
    });
});
