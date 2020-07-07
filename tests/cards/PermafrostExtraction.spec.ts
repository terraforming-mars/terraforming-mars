import { expect } from "chai";
import { PermafrostExtraction } from "../../src/cards/PermafrostExtraction";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PermafrostExtraction", function () {
    let card : PermafrostExtraction, player : Player, game : Game;

    beforeEach(function() {
        card = new PermafrostExtraction();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -8;
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);        
        action!.cb(action!.availableSpaces[0]);
        expect(game.board.getOceansOnBoard()).to.eq(1);
    });
});
