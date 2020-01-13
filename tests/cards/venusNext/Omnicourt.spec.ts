import { expect } from "chai";
import { Omnicourt } from "../../../src/cards/venusNext/Omnicourt";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Omnicourt", function () {
    it("Should play", function () {
        const card = new Omnicourt();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.terraformRating).to.eq(22);
    });
});