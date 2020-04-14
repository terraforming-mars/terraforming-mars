
import { expect } from "chai";
import { PhoboLog } from "../../../src/cards/corporation/PhoboLog";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("PhoboLog", function () {
    it("Should play", function () {
        const card = new PhoboLog();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.titanium).to.eq(10);
        expect(player.getTitaniumValue(game)).to.eq(4);
    });
});
