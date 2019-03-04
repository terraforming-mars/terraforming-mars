
import { expect } from "chai";
import { Decomposers } from "../../src/cards/Decomposers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Algae } from "../../src/cards/Algae";
import { Birds } from "../../src/cards/Birds";

describe("Decomposers", function () {
    it("Should throw", function () {
        const card = new Decomposers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 3% oxygen");
    });
    it("Should play", function () {
        const card = new Decomposers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 1); // 3
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.cardPlayedEvents.length).to.eq(1);
        expect(game.onGameEnd.length).to.eq(1);
        player.cardPlayedEvents[0](new Birds());
        expect(card.microbes).to.eq(1);
        player.cardPlayedEvents[0](card);
        expect(card.microbes).to.eq(2);
        player.cardPlayedEvents[0](new Algae());
        expect(card.microbes).to.eq(3);
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(1);
    });
});
