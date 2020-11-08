import { expect } from "chai";
import { AICentral } from "../../src/cards/AICentral";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from "../../src/Resources";

describe("AICentral", function () {
    let card : AICentral, player : Player, game : Game;

    beforeEach(function() {
        card = new AICentral();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play if not enough science tags to play", function () {
        expect(card.canPlay(player)).is.not.true; 
    });

    it("Can't play if no energy production", function () {
        player.playedCards.push(card, card, card);
        expect(card.canPlay(player)).is.not.true; 
    });

    it("Should play", function () {
        player.playedCards.push(card, card, card);
        player.addProduction(Resources.ENERGY);

        card.play(player);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });

    it("Should take action", function () {
        card.action(player, game);
        expect(player.cardsInHand).has.lengthOf(2);
    });
});
