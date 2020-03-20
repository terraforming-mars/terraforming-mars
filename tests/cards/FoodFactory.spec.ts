
import { expect } from "chai";
import { FoodFactory } from "../../src/cards/FoodFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("FoodFactory", function () {
    it("Can't play", function () {
        const card = new FoodFactory();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new FoodFactory();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.PLANTS);
        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
