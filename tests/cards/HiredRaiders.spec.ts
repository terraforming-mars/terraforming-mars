
import { expect } from "chai";
import { HiredRaiders } from "../../src/cards/HiredRaiders";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("HiredRaiders", function () {
    it("Should play", function () {
        const card = new HiredRaiders();
        const player = new Player("test", Color.BLUE, false);
        const anotherPlayer = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,anotherPlayer], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action.options.length).to.eq(2);
        anotherPlayer.steel = 2;
        anotherPlayer.megaCredits = 2;
        action.options[1].cb(anotherPlayer);
        expect(anotherPlayer.megaCredits).to.eq(0);
        expect(player.megaCredits).to.eq(2);
    });
});
