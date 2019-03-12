
import { expect } from "chai";
import { MiningExpedition } from "../../src/cards/MiningExpedition";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("MiningExpedition", function () {
    it("Should play", function () {
        const card = new MiningExpedition();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        player.plants = 2;
        action.cb(player);
        expect(player.plants).to.eq(0);
        expect(player.steel).to.eq(2);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
