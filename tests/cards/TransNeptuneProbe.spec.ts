
import { expect } from "chai";
import { TransNeptuneProbe } from "../../src/cards/TransNeptuneProbe";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TransNeptuneProbe", function () {
    it("Should play", function () {
        const card = new TransNeptuneProbe();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
    });
});
