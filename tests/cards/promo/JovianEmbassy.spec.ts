import { expect } from "chai";
import { JovianEmbassy } from "../../../src/cards/promo/JovianEmbassy";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("JovianEmbassy", function () {
    it("Should play", function () {
        const card = new JovianEmbassy();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        
        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(21);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
