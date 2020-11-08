import { expect } from "chai";
import { HiredRaiders } from "../../src/cards/HiredRaiders";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("HiredRaiders", function () {
    let card : HiredRaiders, player : Player, player2: Player, game: Game;

    beforeEach(function() {
        card = new HiredRaiders();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        player.megaCredits = 10;
        player2.steel = 2;
        player2.megaCredits = 2;

        const action = card.play(player, game) as OrOptions;
        expect(action.options).has.lengthOf(2);
        action.options[1].cb();
        expect(player2.megaCredits).to.eq(0);
        expect(player.megaCredits).to.eq(12);

        action.options[0].cb();
        expect(player2.steel).to.eq(0);
        expect(player.steel).to.eq(2);
    });

    it("Works in solo", function () {
        game = new Game("foobar", [player], player);

        const action = card.play(player, game) as OrOptions;
        expect(action.options).has.lengthOf(2);

        action.options[0].cb();
        expect(player.steel).to.eq(2);

        action.options[1].cb();
        expect(player.megaCredits).to.eq(3);
    });
});
