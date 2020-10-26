
import { expect } from "chai";
import { StandardTechnology } from "../../src/cards/StandardTechnology";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { StandardProjectType } from "../../src/StandardProjectType";

describe("StandardTechnology", function () {
    it("Should play", function () {
        const card = new StandardTechnology();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play();
        card.onStandardProject(player, StandardProjectType.SELLING_PATENTS);
        expect(player.megaCredits).to.eq(0);
        card.onStandardProject(player, StandardProjectType.ASTEROID);
        expect(player.megaCredits).to.eq(3);
        expect(action).is.undefined;
    });
});
