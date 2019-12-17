
import { expect } from "chai";
import { Sabotage } from "../../src/cards/Sabotage";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Sabotage", function () {
    it("Should play", function () {
        const card = new Sabotage();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        player.titanium = 3;
        player.steel = 4;
        player.megaCredits = 7;
        if (action !== undefined) {
            action.options[0].cb(player);
            expect(player.titanium).to.eq(0);
        }
    });
});
