
import { expect } from "chai";
import { SoilFactory } from "../../src/cards/SoilFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("SoilFactory", function () {
    it("Should throw", function () {
        const card = new SoilFactory();
        const player = new Player("test", Color.BLUE, false);
        expect(function () { card.play(player); }).to.throw("Must have energy production");
    });
    it("Should play", function () {
        const card = new SoilFactory();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});
