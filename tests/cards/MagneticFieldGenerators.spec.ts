
import { expect } from "chai";
import { MagneticFieldGenerators } from "../../src/cards/MagneticFieldGenerators";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';
import { Game } from '../../src/Game';

describe("MagneticFieldGenerators", function () {
    it("Should throw", function () {
        const card = new MagneticFieldGenerators();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MagneticFieldGenerators();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY,4);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.getTerraformRating()).to.eq(23);
    });
});
