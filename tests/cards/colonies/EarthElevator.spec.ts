import { expect } from "chai";
import { EarthElevator } from "../../../src/cards/colonies/EarthElevator";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("EarthElevator", function () {
    it("Should play", function () {
        const card = new EarthElevator();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.TITANIUM)).to.eq(3);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(4);
    });
});