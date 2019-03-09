
import { expect } from "chai";
import { ImportOfAdvancedGHG } from "../../src/cards/ImportOfAdvancedGHG";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ImportOfAdvancedGHG", function () {
    it("Should play", function () {
        const card = new ImportOfAdvancedGHG();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.heatProduction).to.eq(2);
    });
});
