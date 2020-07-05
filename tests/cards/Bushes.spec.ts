import { expect } from "chai";
import { Bushes } from "../../src/cards/Bushes";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Bushes", function () {
    let card : Bushes, player : Player, game : Game;

    beforeEach(function() {
        card = new Bushes();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -10;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        expect(player.plants).to.eq(2);
    });
});
