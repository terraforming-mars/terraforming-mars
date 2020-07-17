import { expect } from "chai";
import { Ironworks } from "../../src/cards/Ironworks";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Ironworks", function () {
    let card : Ironworks, player : Player, game : Game;

    beforeEach(function() {
        card = new Ironworks();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act without enough energy", function () {
        player.energy = 3;
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Should act", function () {
        player.energy = 4;
        expect(card.canAct(player, game)).to.eq(true);

        card.action(player, game);
        expect(player.energy).to.eq(0);
        expect(player.steel).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
