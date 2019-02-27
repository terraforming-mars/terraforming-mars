
import { expect } from "chai";
import { AntiGravityTechnology } from "../../src/cards/AntiGravityTechnology";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AntiGravityTechnology", function () {
    it("Should throw without science tags", function () {
        const card = new AntiGravityTechnology();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 7 science tags");
    });
    it("Should play", function () {
        const card = new AntiGravityTechnology();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card, card, card, card, card, card);
        card.play(player, game);
        expect(player.victoryPoints).to.eq(3);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](card)).to.eq(2); 
    });
});
