
import { expect } from "chai";
import { MiningExpedition } from "../../src/cards/MiningExpedition";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("MiningExpedition", function () {
    it("Should play", function () {
        const card = new MiningExpedition();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        card.play(player, game);
        expect(player.steel).to.eq(2);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
