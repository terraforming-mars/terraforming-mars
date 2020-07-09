import { expect } from "chai";
import { StanfordTorus } from "../../../src/cards/promo/StanfordTorus";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("StanfordTorus", function () {
    let card : StanfordTorus, player : Player, game : Game;

    beforeEach(function() {
        card = new StanfordTorus();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(game.getCitiesInPlay()).to.eq(1);
    });

    it("Should give victory points", function () {
        card.play(player, game);
        expect(card.getVictoryPoints()).to.eq(2);
    });
});