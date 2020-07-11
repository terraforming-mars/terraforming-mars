import { expect } from "chai";
import { SubCrustMeasurements } from "../../../src/cards/promo/SubCrustMeasurements";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Research } from "../../../src/cards/Research";

describe("SubCrustMeasurements", function () {
    let card : SubCrustMeasurements, player : Player, game : Game;

    beforeEach(function() {
        card = new SubCrustMeasurements();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play if not enough science tags", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(true);

        card.play();
        expect(card.getVictoryPoints()).to.eq(2);
    });

    it("Should take action", function () {
        expect(player.cardsInHand.length).to.eq(0);
        card.action(player, game);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
