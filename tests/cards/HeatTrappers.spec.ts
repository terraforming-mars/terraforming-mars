
import { expect } from "chai";
import { HeatTrappers } from "../../src/cards/HeatTrappers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("HeatTrappers", function () {
    it("Should be playable in solo mode", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        // Not enough according to card requirements
        // but it's not important in solo mode
        player.setProduction(Resources.HEAT);

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(player.getProduction(Resources.HEAT)).to.eq(1); // Not changed
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1); // Incremented
    });

    it("Should be fast-playable with one default target", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar2", [player, player2], player);

        player2.setProduction(Resources.HEAT,7);

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(player.getProduction(Resources.HEAT)).to.eq(0); // Not changed
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1); // Incremented
    });

    it("Can't play", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);

        const game = new Game("foobar3", [player, player2], player);

        expect(card.canPlay(player, game)).to.eq(false);
    });

});
