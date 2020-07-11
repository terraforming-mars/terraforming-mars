import { expect } from "chai";
import { BiomassCombustors } from "../../src/cards/BiomassCombustors";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("BiomassCombustors", function () {
    let card : BiomassCombustors, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new BiomassCombustors();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Cannot play if oxygen requirement not met", function () {
        player2.setProduction(Resources.PLANTS, 1);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Cannot play if no one has plant production", function () {
        (game as any).oxygenLevel = 6;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can play in solo mode if oxygen requirement is met", function () {
        const game = new Game("foobar", [player], player);
        (game as any).oxygenLevel = 6;
        expect(card.canPlay(player, game)).to.eq(true);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 6;
        player2.setProduction(Resources.PLANTS, 1);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(game.interrupts.length).to.eq(0);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
        expect(player2.getProduction(Resources.PLANTS)).to.eq(0);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    });
});
