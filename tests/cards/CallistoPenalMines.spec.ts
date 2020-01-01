
import { expect } from "chai";
import { CallistoPenalMines } from "../../src/cards/CallistoPenalMines";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("CallistoPenalMines", function () {
    it("Should play", function () {
        const card = new CallistoPenalMines();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
    });
});
