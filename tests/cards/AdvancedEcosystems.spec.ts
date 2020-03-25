
import { expect } from "chai";
import { AdvancedEcosystems } from "../../src/cards/AdvancedEcosystems";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { TundraFarming } from "../../src/cards/TundraFarming";
import { ResearchNetwork } from '../../src/cards/prelude/ResearchNetwork';

describe("AdvancedEcosystems", function () {
    it("Should play", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new TundraFarming);
        expect(card.canPlay(player)).to.eq(false);
        player.playedCards.push(new ResearchNetwork());
        expect(card.canPlay(player)).to.eq(false);
        player.playedCards.push(new Tardigrades());
        expect(card.canPlay(player)).to.eq(true);
        card.play();
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
    });
    it("Can't play if tag requirements is unmet", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
});
