
import { expect } from "chai";
import { LunarBeam } from "../../src/cards/LunarBeam";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("LunarBeam", function () {
    it("Can play", function () {
        const card = new LunarBeam();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.MEGACREDITS,-4);
        expect(card.canPlay(player)).to.eq(false);
        player.setProduction(Resources.MEGACREDITS);
        expect(card.canPlay(player)).to.eq(true);
    });
    it("Should play", function () {
        const card = new LunarBeam();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    });
});
