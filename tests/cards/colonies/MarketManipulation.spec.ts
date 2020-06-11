import { expect } from "chai";
import { MarketManipulation } from "../../../src/cards/colonies/MarketManipulation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Luna } from '../../../src/colonies/Luna';
import { Triton } from '../../../src/colonies/Triton';
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

        const action = card.play(player, game) as OrOptions;
        expect(action).not.to.eq(undefined);
        expect(action.options[0].title).to.eq("Increase Luna (MegaCredits) and decrease Triton (Titanium)")
        action.options[0].cb();

        expect(colony1.trackPosition).to.eq(2);
        expect(colony2.trackPosition).to.eq(0);
    });
});