
import { expect } from "chai";
import { SearchForLife } from "../../src/cards/SearchForLife";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Tags } from "../../src/cards/Tags";

describe("SearchForLife", function () {
    it("Can't act", function () {
        const card = new SearchForLife();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SearchForLife();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(0);
        player.addResourceTo(card);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(3);
    });
    it("Should act", function () {
        const card = new SearchForLife();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player], player);
        while (game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] === Tags.MICROBES) === undefined ||
               game.dealer.discarded.find((c) => c.tags.length === 1 && c.tags[0] !== Tags.MICROBES) === undefined) {
            player.megaCredits = 1;
            const action = card.action(player, game);
            expect(action).to.eq(undefined);
            expect(player.megaCredits).to.eq(0);
        }
        expect(player.getResourcesOnCard(card) >= 1).to.eq(true);    
    });
});
