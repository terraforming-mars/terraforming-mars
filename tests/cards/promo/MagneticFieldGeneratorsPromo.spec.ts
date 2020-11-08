import { expect } from "chai";
import { MagneticFieldGeneratorsPromo } from "../../../src/cards/promo/MagneticFieldGeneratorsPromo";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";

describe("MagneticFieldGeneratorsPromo", function () {
    let card : MagneticFieldGeneratorsPromo, player : Player, game : Game;

    beforeEach(function() {
        card = new MagneticFieldGeneratorsPromo();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Cannot play without enough energy production", function () {
        player.addProduction(Resources.ENERGY,3);
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        player.addProduction(Resources.ENERGY,4);
        expect(card.canPlay(player, game)).is.true;

        const action = card.play(player, game);
        expect(action instanceof SelectSpace).is.true;
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.getTerraformRating()).to.eq(23);
    });
});
