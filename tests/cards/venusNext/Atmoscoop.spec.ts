import { expect } from "chai";
import { Atmoscoop } from "../../../src/cards/venusNext/Atmoscoop";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';

describe("Atmoscoop", function () {
    it("Should play", function () {
        const card = new Atmoscoop();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        expect(card.canPlay(player)).to.eq(false);

        const action = card.play(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        if ( ! (action instanceof OrOptions)) return;

        expect(action.options.length).to.eq(2);
        const orOptions = action.options[1] as OrOptions;

        orOptions.cb();

        expect(game.getVenusScaleLevel()).to.eq(4);
    });
});