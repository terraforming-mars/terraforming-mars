import { expect } from "chai";
import { SubZeroSaltFish } from "../../../src/cards/colonies/SubZeroSaltFish";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Resources } from '../../../src/Resources';

describe("SubZeroSaltFish", function () {
    it("Can't play", function () {
        const card = new SubZeroSaltFish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should act", function () {
        const card = new SubZeroSaltFish();
        card.action();
        expect(card.resourceCount).to.eq(1);
    });
    it("Should play", function () {
        const card = new SubZeroSaltFish();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2, player3], player);

        // Fit minimal requirements
        (game as any).temperature = 2;

        player2.setProduction(Resources.PLANTS,2);
        player3.setProduction(Resources.PLANTS,7);

        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        
        player.addResourceTo(card, 5);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
    });
});