import { expect } from "chai";
import { GeneRepair } from "../../src/cards/GeneRepair";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("GeneRepair", function () {
    let card : GeneRepair, player : Player, game : Game;

    beforeEach(function() {
        card = new GeneRepair();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(card, card, card);
        expect(card.canPlay(player)).to.eq(true);
        card.play(player, game);
        
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});
