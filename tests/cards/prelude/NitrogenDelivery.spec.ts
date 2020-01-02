
import { expect } from "chai";
import { NitrogenDelivery } from "../../../src/cards/prelude/NitrogenDelivery";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("NitrogenDelivery", function () {
    it("Should play", function () {
        const card = new NitrogenDelivery();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.terraformRating).to.eq(21);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(player.megaCredits).to.eq(5);
    });
});
