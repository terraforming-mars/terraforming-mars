
import { expect } from "chai";
import { Ants } from "../../src/cards/Ants";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";

describe("Ants", function () {
    it("Should throw without oxygen", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 4% oxygen");
    });

    it("Should play", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2);
        game.increaseOxygenLevel(player, 2);
        card.play(player, game);
        expect(game.onGameEnd.length).to.eq(1);
        card.microbes = 5;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(2);
    });
    it("Should action", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.action(player, game); }).to.throw("No cards to remove microbes from");
        player.playedCards.push(card);
        expect(function () { card.action(player, game); }).to.throw("No cards to remove microbes from");
        card.microbes = 1;
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        expect(action.cards.length).to.eq(1);
        expect(action.cards[0]).to.eq(card);
        action.cb([action.cards[0]]);
        expect(card.microbes).to.eq(1);
        const otherCard = new Ants();
        otherCard.microbes = 1;
        action.cb([otherCard]);
        expect(otherCard.microbes).to.eq(0);
        expect(card.microbes).to.eq(2);
    });
});
