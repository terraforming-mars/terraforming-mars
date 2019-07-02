
import { expect } from "chai";
import { Ants } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";

describe("Ants", function () {
    it("Can't play without oxygen", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.play();
        player.addResourceTo(card, 5);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(2);
    });
    it("Should action", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canAct(player, game)).to.eq(false);
        player.playedCards.push(card);
        expect(card.canAct(player, game)).to.eq(false);
        player.addResourceTo(card);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        expect(action.cards.length).to.eq(1);
        expect(action.cards[0]).to.eq(card);
        action.cb([action.cards[0]]);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        const otherCard = new Ants();
        player.playedCards.push(otherCard);
        player.addResourceTo(otherCard);
        action.cb([otherCard]);
        expect(player.getResourcesOnCard(otherCard)).to.eq(2);
        expect(player.getResourcesOnCard(card)).to.eq(2);
    });
});
