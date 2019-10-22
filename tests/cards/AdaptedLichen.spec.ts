
import { expect } from "chai";
import { AdaptedLichen } from "../../src/cards/AdaptedLichen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AdaptedLichen", function () {
    it("Should play", function () {
        const card = new AdaptedLichen();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play(player, game);
        expect(player.plantProduction).to.eq(1);
    });
});
