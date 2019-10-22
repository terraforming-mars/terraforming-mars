
import { expect } from "chai";
import { SmallAnimals } from "../../src/cards/SmallAnimals";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("SmallAnimals", function () {
    it("Can't play", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should act", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.action(player);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
    it("Should play", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.plantProduction = 1;
        player.playedCards.push(card);
        const action = card.play(player, game);
        //expect(action).not.to.eq(undefined);
        if (action !== undefined) {
            action.cb(player);
        }
        expect(player.plantProduction).to.eq(0);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(0);
        player.addResourceTo(card, 3);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(1);
    });
});
