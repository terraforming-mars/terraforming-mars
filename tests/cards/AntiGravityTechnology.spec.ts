import { expect } from "chai";
import { AntiGravityTechnology } from "../../src/cards/AntiGravityTechnology";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("AntiGravityTechnology", function () {
    let card : AntiGravityTechnology, player : Player;

    beforeEach(function() {
        card = new AntiGravityTechnology();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(card, card, card, card, card, card, card);
        expect(card.canPlay(player)).to.eq(true);

        card.play();
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
        expect(card.getCardDiscount()).to.eq(2); 
    });
});
