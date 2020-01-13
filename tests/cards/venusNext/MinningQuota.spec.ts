import { expect } from "chai";
import { MinningQuota } from "../../../src/cards/venusNext/MinningQuota";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("MinningQuota", function () {
    it("Should play", function () {
        const card = new MinningQuota();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay()).to.eq(false);
        const action = card.play();
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });
});