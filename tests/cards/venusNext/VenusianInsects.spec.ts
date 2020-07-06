import { expect } from "chai";
import { VenusianInsects } from "../../../src/cards/venusNext/VenusianInsects";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("VenusianInsects", function () {
    let card : VenusianInsects, player : Player, game : Game;

    beforeEach(function() {
        card = new VenusianInsects();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 10;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player, game)).to.eq(true);
        player.playedCards.push(card);

        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Gives victory points", function () {
        player.addResourceTo(card, 7);
        expect(card.getVictoryPoints()).to.eq(3);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
});
