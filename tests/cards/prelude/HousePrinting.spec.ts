
import { expect } from "chai";
import { HousePrinting } from "../../../src/cards/prelude/HousePrinting";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("HousePrinting", function () {
    it("Should play", function () {
        const card = new HousePrinting();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
    });
});
