
import { expect } from "chai";
import { GHGFactories } from "../../src/cards/GHGFactories";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("GHGFactories", function () {
    it("Should throw", function () {
        const card = new GHGFactories();
        const player = new Player("test", Color.BLUE, false);
        expect(function () { card.play(player); }).to.throw("Must have energy production to decrease");
    });
    it("Should play", function () {
        const card = new GHGFactories();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.HEAT)).to.eq(4);
    });
});
