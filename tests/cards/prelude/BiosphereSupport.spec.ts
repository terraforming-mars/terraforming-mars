
import { expect } from "chai";
import { BiosphereSupport } from "../../../src/cards/prelude/BiosphereSupport";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("BiosphereSupport", function () {
    it("Can play", function () {
        const card = new BiosphereSupport();
        const player = new Player("test", Color.BLUE, false);
        const action = card.canPlay(player);
        expect(action).to.eq(true);
        player.setProduction(Resources.MEGACREDITS,-5);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new BiosphereSupport();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    });
});
