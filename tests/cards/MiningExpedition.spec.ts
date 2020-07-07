import { expect } from "chai";
import { MiningExpedition } from "../../src/cards/MiningExpedition";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("MiningExpedition", function () {
    let card : MiningExpedition, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new MiningExpedition();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        player2.plants = 8;
        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        const orOptions = game.interrupts[0].playerInput as OrOptions;
        orOptions.options[0].cb();
        expect(player2.plants).to.eq(6);

        expect(player.steel).to.eq(2);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
