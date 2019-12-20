
import { expect } from "chai";
import { Fish } from "../../src/cards/Fish";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Fish", function () {
    it("Can't play", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should act", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        card.action(player);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
    it("Should play", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2, player3], player);

        // Fit minimal requirements
        (game as any).temperature = 2;

        player2.plantProduction = 3;
        player3.plantProduction = 7;

        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof SelectPlayer).to.eq(true);
        if (action === undefined) return;

        action.cb(player3);

        expect(player3.plantProduction).to.eq(6); // reduced one step
        expect(player2.plantProduction).to.eq(3); // no side effects on other than target players
        expect(player.plantProduction).to.eq(0); // no negative values etc.

        player.addResourceTo(card, 5);
        card.onGameEnd(player);
        
        expect(player.victoryPoints).to.eq(player.getResourcesOnCard(card));
    });
});
