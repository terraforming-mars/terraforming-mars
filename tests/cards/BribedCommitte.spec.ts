
import { expect } from "chai";
import { BribedCommitte } from "../../src/cards/BribedCommitte";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from '../../src/Game';

describe("BribedCommitte", function () {
    it("Should play", function () {
        const card = new BribedCommitte();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play(player, game);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
        expect(player.getTerraformRating()).to.eq(22);
    });
});
