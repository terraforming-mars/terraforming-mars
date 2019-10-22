
import { expect } from "chai";
import { Livestock } from "../../src/cards/Livestock";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Livestock", function () {
    it("Can't play", function () {
        const card = new Livestock();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        game.increaseOxygenLevel(player, 2); // 8
        game.increaseOxygenLevel(player, 1); // 9
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Livestock();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        player.plantProduction = 1;
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(2);
        player.addResourceTo(card, 4);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(4);
    });
    it("Should act", function () {
        const card = new Livestock();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.action(player);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
});
