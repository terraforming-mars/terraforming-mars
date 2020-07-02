import { expect } from "chai";
import { SubCrustMeasurements } from "../../../src/cards/promo/SubCrustMeasurements";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("SubCrustMeasurements", function () {
    it("Can't play if not enough science tags", function () {
        const card = new SubCrustMeasurements();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false); 
    });
    it("Should play", function () {
        const card = new SubCrustMeasurements();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.play();
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
    it("Should take action", function () {
        const card = new SubCrustMeasurements();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(player.cardsInHand.length).to.eq(0);
        card.action(player, game);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
