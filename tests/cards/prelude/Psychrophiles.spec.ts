import { expect } from "chai";
import { Psychrophiles } from "../../../src/cards/prelude/Psychrophiles";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("Psychrophiles", function () {
    let card : Psychrophiles, player : Player, game : Game;

    beforeEach(function() {
        card = new Psychrophiles();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't play", function () {
        (game as any).temperature = -18;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Can act", function () {
        expect(card.canAct()).to.eq(true);
    });

    it("Should act", function () {
        expect(player.getMicrobesCanSpend()).to.eq(0);
        player.playedCards.push(card);
        
        card.action(player);
        expect(player.getCardsWithResources().length).to.eq(1);
        expect(player.getMicrobesCanSpend()).to.eq(1);
    });
});
