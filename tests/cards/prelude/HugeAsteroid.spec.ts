
import { expect } from "chai";
import { HugeAsteroid } from "../../../src/cards/prelude/HugeAsteroid";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("HugeAsteroid", function () {
    it("Can play", function () {
        const card = new HugeAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        expect(card.canPlay(player, game)).to.eq(false);
        player.megaCredits = 5;
        expect(card.canPlay(player, game)).to.eq(true);

    });
    it("Should play", function () {
        const card = new HugeAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(-5);
    });
});
