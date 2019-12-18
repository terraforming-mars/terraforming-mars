
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

        const game = new Game("foobar", [player,player2], player);

        // requirements
        player2.plantProduction = 2;
        (game as any).oxygenLevel = 13;

        // Play card
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        player.playedCards.push(card);

        if (action !== undefined) {
            // Check action to reduce plant production
            expect(action instanceof SelectPlayer).to.eq(true);
            action.cb(player2);
            expect(player2.plantProduction).to.eq(0);

            // Check victory points assignment
            player.addResourceTo(card, 2); 
            card.onGameEnd(player);
            expect(player.victoryPoints).to.eq(2);
        }
    });
    it("Should act", function () {
        const card = new Birds();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.action(player);
        expect(player.getResourcesOnCard(card)).to.eq(1); 
    });
});
