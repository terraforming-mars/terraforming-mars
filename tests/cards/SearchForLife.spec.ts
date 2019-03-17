
import { expect } from "chai";
import { SearchForLife } from "../../src/cards/SearchForLife";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Tags } from "../../src/cards/Tags";

describe("SearchForLife", function () {
    it("Should throw", function () {
        const card = new SearchForLife();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.action(player, game); }).to.throw("Must have mega credit");
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        game.increaseOxygenLevel(player, 1); // 7
        expect(function () { card.play(player, game); }).to.throw("Oxygen must be 6% or less");
    });
    it("Should play", function () {
        const card = new SearchForLife();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.onGameEnd.length).to.eq(1);
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(0);
        card.scienceResources++;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(3);
    });
    it("Should act", function () {
        const card = new SearchForLife();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        while (game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] === Tags.MICROBES) === undefined ||
               game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] !== Tags.MICROBES) === undefined) {
            player.megaCredits = 1;
            const action = card.action(player, game);
            expect(action).to.eq(undefined);
            expect(player.megaCredits).to.eq(0);
        }
        expect(card.scienceResources >= 1).to.eq(true);    
    });
});
