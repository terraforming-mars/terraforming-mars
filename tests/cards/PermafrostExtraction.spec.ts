
import { expect } from "chai";
import { PermafrostExtraction } from "../../src/cards/PermafrostExtraction";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PermafrostExtraction", function () {
    it("Can't play", function () {
        const card = new PermafrostExtraction();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new PermafrostExtraction();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
    });
});
