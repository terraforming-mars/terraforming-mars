import { expect } from "chai";
import { AsteroidMiningConsortium } from "../../src/cards/AsteroidMiningConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("AsteroidMiningConsortium", function () {
    let card : AsteroidMiningConsortium, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new AsteroidMiningConsortium();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play if no titanium production", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Can play if player has titanium production", function () {
        player.setProduction(Resources.TITANIUM);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player, game);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
