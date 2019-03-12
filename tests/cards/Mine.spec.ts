
import { expect } from "chai";
import { Mine } from "../../src/cards/Mine";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Mine", function () {
    it("Should play", function () {
        const card = new Mine();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.steelProduction).to.eq(1);
    });
});
