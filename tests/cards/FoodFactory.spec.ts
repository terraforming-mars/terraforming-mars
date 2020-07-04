import { expect } from "chai";
import { FoodFactory } from "../../src/cards/FoodFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("FoodFactory", function () {
    let card : FoodFactory, player : Player;

    beforeEach(function() {
        card = new FoodFactory();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.PLANTS);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
        
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
