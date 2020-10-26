
import { expect } from "chai";
import { SubterraneanReservoir } from "../../src/cards/SubterraneanReservoir";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("SubterraneanReservoir", function () {
    it("Should play", function () {
        const card = new SubterraneanReservoir();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).is.undefined;
    });
});
