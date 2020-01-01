
import { expect } from "chai";
import { BuildingIndustries } from "../../src/cards/BuildingIndustries";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("BuildingIndustries", function () {
    it("Can't play", function () {
        const card = new BuildingIndustries();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new BuildingIndustries();
        const player = new Player("test", Color.BLUE, false);
        player.energyProduction = 1;
        card.play(player);
        expect(player.energyProduction).to.eq(0);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });
});
