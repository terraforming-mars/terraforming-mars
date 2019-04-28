
import { expect } from "chai";
import { BreathingFilters } from "../../src/cards/BreathingFilters";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("BreathingFilters", function () {
    it("Can't play", function () {
        const card = new BreathingFilters();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foo", [player], player); 
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new BreathingFilters();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.victoryPoints).to.eq(2);
    });
});
