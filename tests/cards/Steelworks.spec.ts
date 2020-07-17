import { expect } from "chai";
import { Steelworks } from "../../src/cards/Steelworks";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Steelworks", function () {
    let card : Steelworks, player : Player, game : Game;

    beforeEach(function() {
        card = new Steelworks();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act", function () {
        player.energy = 3;
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Should act", function () {
        player.energy = 4;
        expect(card.canAct(player, game)).to.eq(true);

        card.action(player, game);
        expect(player.energy).to.eq(0);
        expect(player.steel).to.eq(2);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
