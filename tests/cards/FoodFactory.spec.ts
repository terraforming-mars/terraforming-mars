
import { expect } from "chai";
import { FoodFactory } from "../../src/cards/FoodFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("FoodFactory", function () {
    it("Should throw", function () {
        const card = new FoodFactory();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have plant production");
    });
    it("Should play", function () {
        const card = new FoodFactory();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.plantProduction = 1;
        card.play(player, game);
        expect(player.plantProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(4);
        expect(player.victoryPoints).to.eq(1);
    });
});
