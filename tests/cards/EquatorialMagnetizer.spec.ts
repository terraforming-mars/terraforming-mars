
import { expect } from "chai";
import { EquatorialMagnetizer } from "../../src/cards/EquatorialMagnetizer";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("EquatorialMagnetizer", function () {
    it("Can't act", function () {
        const card = new EquatorialMagnetizer();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new EquatorialMagnetizer();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new EquatorialMagnetizer();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.ENERGY);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.terraformRating).to.eq(21);
    });
});
