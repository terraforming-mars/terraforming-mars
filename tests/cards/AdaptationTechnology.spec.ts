
import { expect } from "chai";
import { AdaptationTechnology } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AdaptationTechnology", function () {
    it("Should play", function () {
        const card = new AdaptationTechnology();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(player.victoryPoints).to.eq(1);
        expect(card.getRequirementBonus()).to.eq(true);
    });
});
