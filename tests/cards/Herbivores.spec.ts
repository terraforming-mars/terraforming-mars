
import { expect } from "chai";
import { Herbivores } from "../../src/cards/Herbivores";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Herbivores", function () {
    it("Can't play", function () {
        const card = new Herbivores();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        for (var i = 0; i < 4; i++) {
            game.increaseOxygenLevel(player, 2);
        }
        expect(card.canPlay(player, game)).to.eq(true);
    });
    it("Should play", function () {
        const card = new Herbivores();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        game.increaseOxygenLevel(player, 2); // 8
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer).to.eq(true);
        player.plantProduction = 1;
        action.cb(player);
        expect(player.plantProduction).to.eq(0);
        player.playedCards.push(card);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        game.addGreenery(player, game.getAvailableSpacesOnLand(player)[0].id);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(1);
        const anotherPlayer = new Player("test", Color.RED, false);
        game.addGreenery(anotherPlayer, game.getAvailableSpacesOnLand(anotherPlayer)[0].id);
        expect(player.getResourcesOnCard(card)).to.eq(2);
    });
});
