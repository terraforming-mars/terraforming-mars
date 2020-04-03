
import { expect } from "chai";
import { GreatEscarpmentConsortium } from "../../src/cards/GreatEscarpmentConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("GreatEscarpmentConsortium", function () {
    it("Should throw", function () {
        const card = new GreatEscarpmentConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new GreatEscarpmentConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.setProduction(Resources.STEEL);
        card.play(player, game);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });
    it("Should play because has steel production", function () {
        const card = new GreatEscarpmentConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player, player2, player3], player);
        player.setProduction(Resources.STEEL);
        expect(card.canPlay(player, game)).to.eq(true);
    });
});
