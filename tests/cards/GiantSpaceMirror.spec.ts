
import { expect } from "chai";
import { GiantSpaceMirror } from "../../src/cards/GiantSpaceMirror";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";

describe("GiantSpaceMirror", function () {
    it("Should play", function () {
        const card = new GiantSpaceMirror();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    });
});
