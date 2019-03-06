
import { expect } from "chai";
import { Fish } from "../../src/cards/Fish";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Fish", function () {
    it("Should throw", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires +2C or warmer");
    });
    it("Should act", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.action(player, game);
        expect(card.animals).to.eq(1);
    });
    it("Should play", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 3); //  -6
        game.increaseTemperature(player, 3); //   0
        game.increaseTemperature(player, 1); //   2
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer).to.eq(true);
        player.plantProduction = 1;
        action.cb(player);
        expect(player.plantProduction).to.eq(0);
        expect(game.onGameEnd.length).to.eq(1);
        card.animals = 5;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(card.animals);
    });
});
