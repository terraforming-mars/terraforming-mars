
import { expect } from "chai";
import { StripMine } from "../../src/cards/StripMine";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

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
        player.setProduction(Resources.ENERGY,2);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(2);
    });
});
