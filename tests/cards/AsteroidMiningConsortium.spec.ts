
import { expect } from "chai";
import { AsteroidMiningConsortium } from "../../src/cards/AsteroidMiningConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("AsteroidMiningConsortium", function () {
    it("Shouldn't play, solo mode but not requirements", function () {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play, player has production", function () {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player, player2, player3], player);
        player.setProduction(Resources.TITANIUM);
        expect(card.canPlay(player)).to.eq(true);
        card.play(player, game);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
    it("Should throw, player doesn't meet requirements", function () {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        player2.setProduction(Resources.TITANIUM);
        expect(card.canPlay(player)).to.eq(false);
    });
});
