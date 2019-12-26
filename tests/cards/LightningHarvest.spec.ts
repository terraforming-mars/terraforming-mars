
import { expect } from "chai";
import { LightningHarvest } from "../../src/cards/LightningHarvest";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { GeneRepair } from "../../src/cards/GeneRepair";

describe("LightningHarvest", function () {
    it("Should throw", function () {
        const card = new LightningHarvest();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 3 science tags");
    });
    it("Should play", function () {
        const card = new LightningHarvest();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(new GeneRepair(), new GeneRepair(), new GeneRepair());
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        expect(player.megaCreditProduction).to.eq(1);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});
