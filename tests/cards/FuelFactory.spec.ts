import { expect } from "chai";
import { FuelFactory } from "../../src/cards/FuelFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("FuelFactory", function () {
    let card : FuelFactory, player : Player;

    beforeEach(function() {
        card = new FuelFactory();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(true);
        card.play(player);
        
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
});
