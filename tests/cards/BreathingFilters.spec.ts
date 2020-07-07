import { expect } from "chai";
import { BreathingFilters } from "../../src/cards/BreathingFilters";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("BreathingFilters", function () {
    let card : BreathingFilters, player : Player, game : Game;

    beforeEach(function() {
        card = new BreathingFilters();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 7;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play();
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});
