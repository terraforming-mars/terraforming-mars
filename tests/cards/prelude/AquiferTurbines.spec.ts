import { expect } from "chai";
import { AquiferTurbines } from "../../../src/cards/prelude/AquiferTurbines";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("AquiferTurbines", function () {
    let card : AquiferTurbines, player : Player, game : Game;

    beforeEach(function() {
        card = new AquiferTurbines();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can play", function () {
        player.megaCredits = 3;
        expect(card.canPlay(player, game)).to.eq(true);
    });
    
    it("Should play", function () {
        player.megaCredits = 3;
        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
        expect(player.megaCredits).to.eq(0);
    });
});
