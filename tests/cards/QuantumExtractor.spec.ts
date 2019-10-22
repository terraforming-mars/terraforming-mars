
import { expect } from "chai";
import { QuantumExtractor } from "../../src/cards/QuantumExtractor";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";

describe("QuantumExtractor", function () {
    it("Can't play", function () {
        const card = new QuantumExtractor();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new QuantumExtractor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card, card, card, card);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(card.getCardDiscount(player, game, card)).to.eq(2);
        expect(card.getCardDiscount(player, game, new Bushes())).to.eq(0);
    });
});
