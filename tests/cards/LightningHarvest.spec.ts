import { expect } from "chai";
import { LightningHarvest } from "../../src/cards/LightningHarvest";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { GeneRepair } from "../../src/cards/GeneRepair";
import { Resources } from '../../src/Resources';

describe("LightningHarvest", function () {
    let card : LightningHarvest, player : Player, game : Game;

    beforeEach(function() {
        card = new LightningHarvest();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new GeneRepair(), new GeneRepair(), new GeneRepair());
        expect(card.canPlay(player)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
