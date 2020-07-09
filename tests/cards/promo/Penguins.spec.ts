import { expect } from "chai";
import { Penguins } from "../../../src/cards/promo/Penguins";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { maxOutOceans } from "../../TestingUtils";

describe("Penguins", function () {
    let card : Penguins, player : Player, game : Game;

    beforeEach(function() {
        card = new Penguins();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't play", function () {
        maxOutOceans(player, game, 7);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        maxOutOceans(player, game, 8);
        expect(card.canPlay(player, game)).to.eq(true);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });

    it("Should give victory points", function () {
        player.playedCards.push(card);
        card.action(player);
        card.action(player);
        expect(card.getVictoryPoints()).to.eq(2);
    });
});
