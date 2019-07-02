
import { expect } from "chai";
import { AntiGravityTechnology } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("AntiGravityTechnology", function () {
    it("Can't play", function () {
        const card = new AntiGravityTechnology();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new AntiGravityTechnology();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card, card, card, card, card, card, card);
        card.play(player);
        expect(player.victoryPoints).to.eq(3);
        expect(card.getCardDiscount()).to.eq(2); 
    });
});
