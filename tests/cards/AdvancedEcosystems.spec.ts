
import { expect } from "chai";
import { AdvancedEcosystems } from "../../src/cards/AdvancedEcosystems";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Pets } from "../../src/cards/Pets";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { TundraFarming } from "../../src/cards/TundraFarming";

describe("AdvancedEcosystems", function () {
    it("Should throw on unmet tag requirements", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        expect(function () { card.play(player); }).to.throw("Requires a plant tag, a microbe tag, and an animal tag");
    });
    it("Should play", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new Tardigrades(), new TundraFarming, new Pets());
        card.play(player);
        expect(player.victoryPoints).to.eq(3);
    });
});
