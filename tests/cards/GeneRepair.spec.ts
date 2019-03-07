
import { expect } from "chai";
import { GeneRepair } from "../../src/cards/GeneRepair";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GeneRepair", function () {
    it("Should throw", function () {
        const card = new GeneRepair();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 3 science tags.");
    });
    it("Should play", function () {
        const card = new GeneRepair();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card, card);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(2);
    });
});
