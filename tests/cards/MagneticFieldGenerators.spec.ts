import { expect } from "chai";
import { MagneticFieldGenerators } from "../../src/cards/MagneticFieldGenerators";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";
import { Game } from "../../src/Game";

describe("MagneticFieldGenerators", function () {
    let card : MagneticFieldGenerators, player : Player, game : Game;

    beforeEach(function() {
        card = new MagneticFieldGenerators();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        player.addProduction(Resources.ENERGY, 4);
        expect(card.canPlay(player, game)).is.true;

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.getTerraformRating()).to.eq(23);
    });
});
