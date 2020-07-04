import { expect } from "chai";
import { IceCapMelting } from "../../src/cards/IceCapMelting";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("IceCapMelting", function () {
    let card : IceCapMelting, player : Player, game : Game;

    beforeEach(function() {
        card = new IceCapMelting();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = 2;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);
    });
});
