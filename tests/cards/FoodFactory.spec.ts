
import { expect } from "chai";
import { FoodFactory } from "../../src/cards/FoodFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("FoodFactory", function () {
    it("Can't play", function () {
        const card = new FoodFactory();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new FoodFactory();
        const player = new Player("test", Color.BLUE, false);
        player.plantProduction = 1;
        card.play(player);
        expect(player.plantProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(4);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});
