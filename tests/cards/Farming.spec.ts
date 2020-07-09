import { expect } from "chai";
import { Farming } from "../../src/cards/Farming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Farming", function () {
    let card : Farming, player : Player, game : Game;

    beforeEach(function() {
        card = new Farming();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = 4;
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player);

        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.plants).to.eq(2);
        
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});
