import { expect } from "chai";
import { LunarBeam } from "../../src/cards/LunarBeam";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("LunarBeam", function () {
    let card : LunarBeam, player : Player;

    beforeEach(function() {
        card = new LunarBeam();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can play", function () {
        player.setProduction(Resources.MEGACREDITS,-4);
        expect(card.canPlay(player)).to.eq(false);

        player.setProduction(Resources.MEGACREDITS);
        expect(card.canPlay(player)).to.eq(true);
    });

    it("Should play", function () {
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    });
});
