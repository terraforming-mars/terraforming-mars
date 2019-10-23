
import { expect } from "chai";
import { GHGFactories } from "../../src/cards/GHGFactories";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GHGFactories", function () {
    it("Should throw", function () {
        const card = new GHGFactories();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have energy production to decrease");
    });
    it("Should play", function () {
        const card = new GHGFactories();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(0);
        expect(player.heatProduction).to.eq(4);
    });
});
