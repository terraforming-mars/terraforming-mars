import { expect } from "chai";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("Tardigrades", function () {
    let card : Tardigrades, player : Player;

    beforeEach(function() {
        card = new Tardigrades();
        player = new Player("test", Color.BLUE, false);
    });

    it("Should play", function () {
        player.playedCards.push(card);
        card.play();
        player.addResourceTo(card, 7);
        expect(card.getVictoryPoints()).to.eq(1);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
});
