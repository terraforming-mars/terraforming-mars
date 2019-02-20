
import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";

describe("Player", function () {
    it("should initialize with right defaults", function () {
        const player = new Player("test", Color.BLUE, false);
        expect(player.corporationCard).to.eq(undefined);
    });
});
