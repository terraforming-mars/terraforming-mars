import { expect } from "chai";
import { QuantumExtractor } from "../../src/cards/QuantumExtractor";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";
import { TollStation } from '../../src/cards/TollStation';

describe("QuantumExtractor", function () {
    let card : QuantumExtractor, player : Player, game : Game;

    beforeEach(function() {
        card = new QuantumExtractor();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(card, card, card, card);
        card.play(player);
        expect(card.getCardDiscount(player, game, new TollStation())).to.eq(2);
        expect(card.getCardDiscount(player, game, new Bushes())).to.eq(0);
    });
});
