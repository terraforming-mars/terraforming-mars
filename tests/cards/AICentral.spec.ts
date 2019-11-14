
import { expect } from "chai";
import { AICentral } from "../../src/cards/AICentral";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AICentral", function () {
    it("Can't play if not enough science tags to play", function () {
        const card = new AICentral();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false); 
    });
    it("Can't play if no energy production", function () {
        const card = new AICentral();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card, card, card);
        expect(card.canPlay(player)).to.eq(false); 
    });
    it("Should play", function () {
        const card = new AICentral();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card, card, card);
        player.energyProduction = 1;
        card.play(player, game);
        expect(player.energyProduction).to.eq(0);
        expect(player.victoryPoints).to.eq(1);
    });
    it("Should take action", function () {
        const card = new AICentral();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(player.cardsInHand.length).to.eq(0);
        card.action(player, game);
        expect(player.cardsInHand.length).to.eq(2);
    });
});
