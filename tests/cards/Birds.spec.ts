
import { expect } from "chai";
import { Birds } from "../../src/cards/Birds";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

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
        player2.plantProduction = 2;
        player3.plantProduction = 7;
        (game as any).oxygenLevel = 13;

        // Play card
        const action = card.play(player, game);
        expect(action instanceof SelectPlayer).to.eq(true);
        if (action === undefined) return;
        player.playedCards.push(card);

        // Check action to reduce plant production
        action.cb(player2);
        expect(player2.plantProduction).to.eq(0);

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
