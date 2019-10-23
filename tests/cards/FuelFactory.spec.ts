
import { expect } from "chai";
import { FuelFactory } from "../../src/cards/FuelFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("FuelFactory", function () {
    it("Should throw", function () {
        const card = new FuelFactory();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have energy production to lose");
    });
    it("Should play", function () {
        const card = new FuelFactory();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.titaniumProduction).to.eq(1);
    });
});
