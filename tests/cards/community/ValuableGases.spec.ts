import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { ValuableGases } from "../../../src/cards/community/ValuableGases";

describe("ValuableGases", function () {
    let card : ValuableGases, player : Player;

    beforeEach(function() {
        card = new ValuableGases();
        player = new Player("test", Color.BLUE, false);
    });

    it("Should play", function () {
        card.play(player);
        expect(player.megaCredits).to.eq(6);
    });
});
