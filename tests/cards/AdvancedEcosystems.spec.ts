
import { expect } from "chai";
import { AdvancedEcosystems } from "../../src/cards/AdvancedEcosystems";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Pets } from "../../src/cards/Pets";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { TundraFarming } from "../../src/cards/TundraFarming";

describe("AdvancedEcosystems", function () {
    it("Should play", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new Tardigrades(), new TundraFarming, new Pets());
        expect(card.canPlay(player)).to.eq(true);
        card.play();
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(3);
    });
    it("Can't play if tag requirements is unmet", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
});
