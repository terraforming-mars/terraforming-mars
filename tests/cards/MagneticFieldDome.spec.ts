
import { expect } from "chai";
import { MagneticFieldDome } from "../../src/cards/MagneticFieldDome";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("MagneticFieldDome", function () {
    it("Should throw", function () {
        const card = new MagneticFieldDome();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(function () { card.play(player, game); }).to.throw("Need 2 energy production to decrease");
    });
    it("Should play", function () {
        const card = new MagneticFieldDome();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY,2);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.plantProduction).to.eq(1);
        expect(player.terraformRating).to.eq(21);
    });
});
