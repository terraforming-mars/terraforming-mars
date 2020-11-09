import { expect } from "chai";
import { RadChemFactory } from "../../src/cards/RadChemFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";
import { Game } from "../../src/Game";

describe("RadChemFactory", function () {
    let card : RadChemFactory, player : Player, game : Game;

    beforeEach(function() {
        card = new RadChemFactory();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        player.addProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).is.true;

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getTerraformRating()).to.eq(22);
    });
});
