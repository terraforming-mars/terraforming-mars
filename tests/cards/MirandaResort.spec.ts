
import { expect } from "chai";
import { MirandaResort } from "../../src/cards/MirandaResort";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { BusinessNetwork } from "../../src/cards/BusinessNetwork";
import { Resources } from "../../src/Resources";

describe("MirandaResort", function () {
    it("Should play", function () {
        const card = new MirandaResort();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new BusinessNetwork());
        const action = card.play(player);
        expect(action).is.undefined;
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});
