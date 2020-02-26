
import { expect } from "chai";
import { EcologyExperts } from "../../../src/cards/prelude/EcologyExperts";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("EcologyExperts", function () {
    it("Gets requirement bonus", function () {
        const card = new EcologyExperts();
        const player = new Player("test", Color.BLUE, false);
        expect(card.getRequirementBonus(player)).to.eq(0);
        (player as any).lastCardPlayedThisTurn = card;
        expect(card.getRequirementBonus(player)).to.eq(50);
    });
    it("Should play", function () {
        const card = new EcologyExperts();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});
