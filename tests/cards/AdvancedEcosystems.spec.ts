import { expect } from "chai";
import { AdvancedEcosystems } from "../../src/cards/AdvancedEcosystems";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { TundraFarming } from "../../src/cards/TundraFarming";
import { ResearchCoordination } from "../../src/cards/prelude/ResearchCoordination";
import { ResearchNetwork } from '../../src/cards/prelude/ResearchNetwork';

describe("AdvancedEcosystems", function () {
    let card : AdvancedEcosystems, player : Player

    beforeEach(function() {
        card = new AdvancedEcosystems();
        player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new TundraFarming(), new ResearchNetwork());
    });

    it("Can't play if tag requirements is unmet", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        expect(card.canPlay(player)).to.eq(false);

        player.playedCards.push(new Tardigrades());
        expect(card.canPlay(player)).to.eq(true);

        card.play();
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
    });

    it("Can play with two wildcards", function () {
        player.playedCards.push(new ResearchCoordination());
        expect(card.canPlay(player)).to.eq(true); 
    });
});
