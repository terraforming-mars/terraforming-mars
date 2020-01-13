import { expect } from "chai";
import { MiningQuota } from "../../../src/cards/venusNext/MiningQuota";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("MiningQuota", function () {
    it("Should play", function () {
        const card = new MiningQuota();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });
});