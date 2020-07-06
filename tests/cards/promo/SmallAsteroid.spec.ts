import { expect } from "chai";
import { SmallAsteroid } from "../../../src/cards/promo/SmallAsteroid";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("SmallAsteroid", function () {
    let card : SmallAsteroid, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new SmallAsteroid();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        player2.setResource(Resources.PLANTS, 3);
        card.play(player, game);
        expect(player2.getResource(Resources.PLANTS)).to.eq(1);
        expect(game.getTemperature()).to.eq(-28);
    });

    it("Doesn't remove plants in solo mode", function() {
        player.setResource(Resources.PLANTS, 3);
        const game = new Game("solo", [player], player);
        card.play(player, game);
        expect(player.getResource(Resources.PLANTS)).to.eq(3);
    });
});
