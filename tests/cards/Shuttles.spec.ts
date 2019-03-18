
import { expect } from "chai";
import { Shuttles } from "../../src/cards/Shuttles";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";
import { TollStation } from "../../src/cards/TollStation";

describe("Shuttles", function () {
    it("Should throw", function () {
        const card = new Shuttles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 5% oxygen");
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 1); // 5
        expect(function () { card.play(player, game); }).to.throw("Must have energy to decrease");
    });
    it("Should play", function () {
        const card = new Shuttles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 1); // 5
        player.energyProduction = 1;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](new Bushes())).to.eq(0);
        expect(player.cardDiscounts[0](new TollStation())).to.eq(2);
    });
});
