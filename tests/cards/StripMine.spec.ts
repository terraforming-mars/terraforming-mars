import { expect } from "chai";
import { StripMine } from "../../src/cards/StripMine";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("StripMine", function () {
    let card : StripMine, player : Player, game : Game;

    beforeEach(function() {
        card = new StripMine();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        player.setProduction(Resources.ENERGY, 1);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY, 2);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(2);
    });
});
