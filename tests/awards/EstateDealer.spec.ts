
import { expect } from "chai";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { EstateDealer } from "../../src/awards/EstateDealer";
import { SpaceType } from "../../src/SpaceType";

describe("EstateDealer", function () {
    it("Correctly counts ocean tiles", function () {
        const award = new EstateDealer();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);

        game.addOceanTile(player2, "34"); // Normal ocean tile
        // This tile should count
        game.addGreenery(player, "35");

        game.addGreenery(player2, "28", SpaceType.OCEAN); // Greenery on ocean space
        // This tile should not count
        game.addGreenery(player, "37");

        expect(award.getScore(player, game)).to.eq(1)
    });
});