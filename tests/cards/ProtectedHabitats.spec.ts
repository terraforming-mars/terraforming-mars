
import { expect } from "chai";
import { ProtectedHabitats } from "../../src/cards/ProtectedHabitats";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ProtectedHabitats", function () {
    it("Should play", function () {
        const card = new ProtectedHabitats();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(player.opponentsCanRemovePlants).to.eq(false);
        expect(player.opponentsCanRemoveAnimals).to.eq(false);
        expect(player.opponentsCanRemoveMicrobes).to.eq(false);
    });
});
