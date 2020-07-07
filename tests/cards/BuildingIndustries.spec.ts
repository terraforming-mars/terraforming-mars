import { expect } from "chai";
import { BuildingIndustries } from "../../src/cards/BuildingIndustries";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("BuildingIndustries", function () {
    let card : BuildingIndustries, player : Player;

    beforeEach(function() {
        card = new BuildingIndustries();
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
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });
});
