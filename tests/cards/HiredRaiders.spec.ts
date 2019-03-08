
import { expect } from "chai";
import { HiredRaiders } from "../../src/cards/HiredRaiders";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("HiredRaiders", function () {
    it("Should play", function () {
        const card = new HiredRaiders();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action.options.length).to.eq(2);
        const anotherPlayer = new Player("test2", Color.RED, false);
        action.options[0].cb(anotherPlayer);
        anotherPlayer.steel = 2;
        anotherPlayer.megaCredits = 2;
        const subAction: OrOptions = action.options[1] as OrOptions;
        subAction.options[0].cb();
        expect(player.steel).to.eq(2);
        subAction.options[1].cb();
        expect(player.megaCredits).to.eq(2);
        expect(action.cb()).to.eq(undefined);
    });
});
