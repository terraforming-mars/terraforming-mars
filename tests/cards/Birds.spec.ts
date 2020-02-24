
import { expect } from "chai";
import { Birds } from "../../src/cards/Birds";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Birds", function () {
    it("Should throw", function () {
        const card = new Birds();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);

        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Birds();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("victim", Color.RED, false);
        const player3 = new Player("safe", Color.RED, false);

        const game = new Game("foobar", [player, player2, player3], player);

        // requirements
        player2.setProduction(Resources.PLANTS,2);
        player3.setProduction(Resources.PLANTS,7);
        (game as any).oxygenLevel = 13;

        // Play card
        card.play(player, game);
        player.playedCards.push(card);

        // Check victory points assignment
        player.addResourceTo(card, 2); 
        expect(card.getVictoryPoints(player)).to.eq(2);
    });
    it("Should act", function () {
        const card = new Birds();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.action(player);
        expect(player.getResourcesOnCard(card)).to.eq(1); 
    });
});
