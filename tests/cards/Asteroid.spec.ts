
import { expect } from "chai";
import { Asteroid } from "../../src/cards/Asteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Asteroid", function () {
    it("Should play", function () {
        const card = new Asteroid();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
});
