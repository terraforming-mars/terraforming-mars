import { expect } from "chai";
import { RegoPlastics } from "../../../src/cards/promo/RegoPlastics";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("RegoPlastics", function () {
    it("Should play", function () {
        const card = new RegoPlastics();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play(player);
        expect(play).to.eq(undefined);
        expect(player.steelValue).to.eq(3);
    });
    it("Should give victory points", function () {
        const card = new RegoPlastics();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play(player);
        expect(play).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});