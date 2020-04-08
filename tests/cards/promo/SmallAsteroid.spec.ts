import { expect } from "chai";
import { SmallAsteroid } from "../../../src/cards/promo/SmallAsteroid";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("SmallAsteroid", function () {
    it("Should play", function () {
        const card = new SmallAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        player2.setResource(Resources.PLANTS, 3);
        const game = new Game("foobar", [player, player2], player);
        const play = card.play(player, game);
        expect(play).to.eq(undefined);
        expect(player2.getResource(Resources.PLANTS)).to.eq(1);
        expect(game.getTemperature()).to.eq(-28);
    });
    it("Doesn't remove plants in solo mode", function() {
        const card = new SmallAsteroid();
        const player = new Player("test", Color.BLUE, false);
        player.setResource(Resources.PLANTS, 3);
        const game = new Game("solo", [player], player);
        const play = card.play(player, game);
        expect(play).to.eq(undefined);
        expect(player.getResource(Resources.PLANTS)).to.eq(3);
    });
});
