
import { expect } from "chai";
import { AdaptationTechnology } from "../../src/cards/AdaptationTechnology";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("AdaptationTechnology", function () {
    it("Should play", function () {
        const card = new AdaptationTechnology();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.victoryPoints).to.eq(1);
        expect(card.getRequirementBonus()).to.eq(2);
    });
});
