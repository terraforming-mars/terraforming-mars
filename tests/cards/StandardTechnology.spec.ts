
import { expect } from "chai";
import { StandardTechnology } from "../../src/cards/StandardTechnology";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { StandardProjectType } from "../../src/StandardProjectType";

describe("StandardTechnology", function () {
    it("Should play", function () {
        const card = new StandardTechnology();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(player.standardProjectHandler.length).to.eq(1);
        player.standardProjectHandler[0](StandardProjectType.SELLING_PATENTS);
        expect(player.megaCredits).to.eq(0);
        player.standardProjectHandler[0](StandardProjectType.ASTEROID);
        expect(player.megaCredits).to.eq(3);
        expect(action).to.eq(undefined);
    });
});
