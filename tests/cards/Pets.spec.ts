import { expect } from "chai";
import { Pets } from "../../src/cards/Pets";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Pets", function () {
    it("Should play", function () {
        const card = new Pets();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 4);
        expect(card.getVictoryPoints()).to.eq(2);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(card.resourceCount).to.eq(6);
    });
});
