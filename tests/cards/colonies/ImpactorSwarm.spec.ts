import { expect } from "chai";
import { ImpactorSwarm } from "../../../src/cards/colonies/ImpactorSwarm";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("ImpactorSwarm", function () {
    let card : ImpactorSwarm, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new ImpactorSwarm();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play when no other player has plants", function () {
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.heat).to.eq(12);
    });

    it("Should be able to remove plants from other player", function () {
        player2.plants = 2;
        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        const orOptions = game.interrupts[0].playerInput as OrOptions;
        orOptions.options[0].cb();
        expect(player2.plants).to.eq(0);
        expect(player.heat).to.eq(12);
    });
});