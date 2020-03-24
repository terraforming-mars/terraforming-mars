
import { expect } from "chai";
import { BiomassCombustors } from "../../src/cards/BiomassCombustors";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("BiomassCombustors", function () {
    it("Should throw", function () {
        const card = new BiomassCombustors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(game.getOxygenLevel()).to.eq(6);
        card.play(player, game);
    });
    it("Should play", function () {
        const card = new BiomassCombustors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(game.getOxygenLevel()).to.eq(6);
        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    });
});
