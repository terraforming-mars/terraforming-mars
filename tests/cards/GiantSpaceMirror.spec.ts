
import { expect } from "chai";
import { GiantSpaceMirror } from "../../src/cards/GiantSpaceMirror";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GiantSpaceMirror", function () {
    it("Should play", function () {
        const card = new GiantSpaceMirror();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(3);
    });
});
