
import { expect } from "chai";
import { IndenturedWorkers } from "../../src/cards/IndenturedWorkers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("IndenturedWorkers", function () {
    it("Should apply card discount until next card played", function () {
        const card = new IndenturedWorkers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play();
        expect(action).is.undefined;
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
        expect(card.getCardDiscount(player, game)).to.eq(0);
    });
});
