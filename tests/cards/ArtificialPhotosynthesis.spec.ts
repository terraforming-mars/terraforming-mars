
import { expect } from "chai";
import { ArtificialPhotosynthesis } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("ArtificialPhotosynthesis", function () {
    it("Should play", function () {
        const card = new ArtificialPhotosynthesis();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action.options.length).to.eq(2);
        action.options[0].cb();
        expect(player.plantProduction).to.eq(1);
        action.options[1].cb();
        expect(player.energyProduction).to.eq(2);
    });
});
