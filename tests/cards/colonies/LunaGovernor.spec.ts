import { expect } from "chai";
import { LunaGovernor } from "../../../src/cards/colonies/LunaGovernor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("LunaGovernor", function () {
    it("Should play", function () {
        const card = new LunaGovernor();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).is.not.true;
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});