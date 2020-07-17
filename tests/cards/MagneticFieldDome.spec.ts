import { expect } from "chai";
import { MagneticFieldDome } from "../../src/cards/MagneticFieldDome";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("MagneticFieldDome", function () {
    let card : MagneticFieldDome, player : Player, game : Game;

    beforeEach(function() {
        card = new MagneticFieldDome();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });
    
    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY, 2);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
