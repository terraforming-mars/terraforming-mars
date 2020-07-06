import { expect } from "chai";
import { EcologyExperts } from "../../../src/cards/prelude/EcologyExperts";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("EcologyExperts", function () {
    let card : EcologyExperts, player : Player;

    beforeEach(function() {
        card = new EcologyExperts();
        player = new Player("test", Color.BLUE, false);
    });

    it("Gets requirement bonus", function () {
        expect(card.getRequirementBonus(player)).to.eq(0);
        player.lastCardPlayed = card;
        expect(card.getRequirementBonus(player)).to.eq(50);
    });

    it("Should play", function () {
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});
