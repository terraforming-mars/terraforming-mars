
import { expect } from "chai";
import { Ironworks } from "../../src/cards/Ironworks";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Ironworks", function () {
    it("Should throw", function () {
        const card = new Ironworks();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.action(player, game); }).to.throw("Need 4 energy to spend");
    });
    it("Should play", function () {
        const card = new Ironworks();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new Ironworks();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energy = 4;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.energy).to.eq(0);
        expect(player.steel).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
