
import { expect } from "chai";
import { Psychrophiles } from "../../../src/cards/prelude/Psychrophiles";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("Psychrophiles", function () {
    it("Can play", function () {
        const card = new Psychrophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(true);
    });
    it("Should play", function () {
        const card = new Psychrophiles();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Can act", function () {
        const card = new Psychrophiles();
        expect(card.canAct()).to.eq(true);
    });
    it("Should act", function () {
        const card = new Psychrophiles();
        const player = new Player("test", Color.BLUE, false);
        expect(player.getMicrobesCanSpend()).to.eq(0);
        player.playedCards.push(card);
        expect(card.action()).to.eq(undefined);
        expect(player.getCardsWithResources().length).to.eq(1);
        expect(player.getMicrobesCanSpend()).to.eq(1);
    });
});
