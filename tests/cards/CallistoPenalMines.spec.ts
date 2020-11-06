
import { expect } from "chai";
import { CallistoPenalMines } from "../../src/cards/CallistoPenalMines";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";

describe("CallistoPenalMines", function () {
    it("Should play", function () {
        const card = new CallistoPenalMines();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});
