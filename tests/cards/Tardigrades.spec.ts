
import { expect } from "chai";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Tardigrades", function () {
    it("Should play", function () {
        const card = new Tardigrades();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.onGameEnd.length).to.eq(1);
        card.microbes = 7;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(1);
    });
    it("Should act", function () {
        const card = new Tardigrades();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.microbes).to.eq(1);
    });
});
