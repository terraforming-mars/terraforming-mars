
import { expect } from "chai";
import { PolarIndustries } from "../../../src/cards/prelude/PolarIndustries";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("PolarIndustries", function () {
    it("Should play", function () {
        const card = new PolarIndustries();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
    });
});
