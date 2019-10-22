
import { expect } from "chai";
import { StripMine } from "../../src/cards/StripMine";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("StripMine", function () {
    it("Should throw", function () {
        const card = new StripMine();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have energy production");
    });
    it("Should play", function () {
        const card = new StripMine();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energyProduction = 2;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(0);
        expect(player.steelProduction).to.eq(2);
        expect(player.titaniumProduction).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(2);
    });
});
