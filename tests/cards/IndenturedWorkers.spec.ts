
import { expect } from "chai";
import { IndenturedWorkers } from "../../src/cards/IndenturedWorkers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("IndenturedWorkers", function () {
    it("Should play", function () {
        const card = new IndenturedWorkers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(-1);
        expect(game.onGenerationEnd.length).to.eq(1);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](card)).to.eq(8);
        expect(player.cardDiscounts.length).to.eq(0);
        expect(game.onGenerationEnd.length).to.eq(0);
        card.play(player, game);
        expect(player.victoryPoints).to.eq(-2);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(game.onGenerationEnd.length).to.eq(1);
        game.onGenerationEnd[0]();
        expect(game.onGenerationEnd.length).to.eq(0);
        expect(player.cardDiscounts.length).to.eq(0);
    });
});
