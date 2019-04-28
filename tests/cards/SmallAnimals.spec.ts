
import { expect } from "chai";
import { SmallAnimals } from "../../src/cards/SmallAnimals";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("SmallAnimals", function () {
    it("Can't play", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(function () { card.play(player, game); }).to.throw("No players with plant production");
    });
    it("Should act", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.action(player, game);
        expect(card.animals).to.eq(1);
    });
    it("Should play", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.plantProduction = 1;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(player);
        expect(player.plantProduction).to.eq(0);
        expect(game.onGameEnd.length).to.eq(1);
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(0);
        card.animals = 3;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(1);
    });
});
