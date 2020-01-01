
import { expect } from "chai";
import { NuclearPower } from "../../src/cards/NuclearPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("NuclearPower", function () {
    it("Should throw", function () {
        const card = new NuclearPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.megaCreditProduction = -4;
        expect(function () { card.play(player, game); }).to.throw("Not enough mega credit production");
    });
    it("Should play", function () {
        const card = new NuclearPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(-2);
        expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    });
});
