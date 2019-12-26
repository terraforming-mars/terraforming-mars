
import { expect } from "chai";
import { OrbitalConstructionYard } from "../../../src/cards/prelude/OrbitalConstructionYard";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("OrbitalConstructionYard", function () {
    it("Should play", function () {
        const card = new OrbitalConstructionYard();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(1);
        expect(player.titanium).to.eq(4);
    });
});
