
import { expect } from "chai";
import { QuantumExtractor } from "../../src/cards/QuantumExtractor";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";

describe("QuantumExtractor", function () {
    it("Should throw", function () {
        const card = new QuantumExtractor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 4 science tags");
    });
    it("Should play", function () {
        const card = new QuantumExtractor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card, card, card);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](card)).to.eq(2);
        expect(player.cardDiscounts[0](new Bushes())).to.eq(0);
    });
});
