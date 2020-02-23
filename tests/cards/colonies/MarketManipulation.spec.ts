import { expect } from "chai";
import { MarketManipulation } from "../../../src/cards/colonies/MarketManipulation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Luna } from '../../../src/colonies/Luna';
import { Triton } from '../../../src/colonies/Triton';
import { AndOptions } from "../../../src/inputs/AndOptions";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("MarketManipulation", function () {
    it("Should play", function () {
        const card = new MarketManipulation();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        let colony1 = new Luna();
        let colony2 = new Triton();

        game.colonies.push(colony1);
        game.colonies.push(colony2);

        const action = card.play(player, game) as AndOptions;
        expect(action).not.to.eq(undefined);

        const orOptions1 = action.options[0] as OrOptions;
        const orOptions2 = action.options[1] as OrOptions;

        orOptions1.options[0].cb();
        orOptions2.options[1].cb();

        expect(colony1.trackPosition).to.eq(2);
        expect(colony2.trackPosition).to.eq(0);
    });
});