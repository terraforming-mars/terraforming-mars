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
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        (game as any).temperature = 2;
        expect(card.canPlay(player, game)).is.true;

        card.play(player, game);
        expect(game.deferredActions).has.lengthOf(1);
    });
});
