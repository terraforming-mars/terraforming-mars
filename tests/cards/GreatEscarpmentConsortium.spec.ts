
import { expect } from "chai";
import { GreatEscarpmentConsortium } from "../../src/cards/GreatEscarpmentConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("GreatEscarpmentConsortium", function () {
    it("Should throw, player doesn't have production", function () {
        const card = new GreatEscarpmentConsortium();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new GreatEscarpmentConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.setProduction(Resources.STEEL);
        expect(card.canPlay(player)).to.eq(true);
        card.play(player, game);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });
});
