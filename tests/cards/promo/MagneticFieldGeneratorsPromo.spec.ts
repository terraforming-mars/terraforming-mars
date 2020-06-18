
import { expect } from "chai";
import { MagneticFieldGeneratorsPromo } from "../../../src/cards/promo/MagneticFieldGeneratorsPromo";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';
import { Game } from '../../../src/Game';
import { SelectSpace } from "../../../src/inputs/SelectSpace";

describe("MagneticFieldGeneratorsPromo", function () {
    it("Cannot play without enough energy production", function () {
        const card = new MagneticFieldGeneratorsPromo();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.ENERGY,3);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MagneticFieldGeneratorsPromo();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY,4);

        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.getTerraformRating()).to.eq(23);
    });
});
