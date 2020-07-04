import { expect } from "chai";
import { Trees } from "../../src/cards/Trees";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Trees", function () {
    let card : Trees, player : Player, game : Game;

    beforeEach(function() {
        card = new Trees();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -4;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(3);
        expect(player.plants).to.eq(1);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
