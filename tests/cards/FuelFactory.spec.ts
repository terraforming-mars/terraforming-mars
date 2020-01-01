
import { expect } from "chai";
import { FuelFactory } from "../../src/cards/FuelFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("FuelFactory", function () {
    it("Should throw", function () {
        const card = new FuelFactory();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new FuelFactory();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
});
