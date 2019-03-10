
import { expect } from "chai";
import { Insects } from "../../src/cards/Insects";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Trees } from "../../src/cards/Trees";

describe("Insects", function () {
    it("Should throw", function () {
        const card = new Insects();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 6% oxygen");
    });
    it("Should play", function () {
        const card = new Insects();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(0);
        player.playedCards.push(new Trees());
        card.play(player, game);
        expect(player.plantProduction).to.eq(1);
    });
});
