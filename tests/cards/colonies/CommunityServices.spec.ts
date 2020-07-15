import { expect } from "chai";
import { CommunityServices } from "../../../src/cards/colonies/CommunityServices";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Aridor } from "../../../src/cards/colonies/Aridor";
import { Resources } from "../../../src/Resources";
import { EccentricSponsor } from "../../../src/cards/prelude/EccentricSponsor";
import { ResearchCoordination } from "../../../src/cards/prelude/ResearchCoordination";
import { SeptumTribus } from "../../../src/cards/turmoil/SeptumTribus";

describe("CommunityServices", function () {
    it("Should play", function () {
        const card = new CommunityServices();
        const corpo = new Aridor();
        const prelude = new EccentricSponsor();
        const researchCoordination = new ResearchCoordination();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(prelude, researchCoordination);
        player.corporationCard = corpo;
        const action = card.play(player);
        expect(action).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints("victoryPoints", card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    });
    it("Wild Tags", function () {
        const card = new CommunityServices();
        const corpo = new SeptumTribus();
        const prelude = new EccentricSponsor();
        const researchCoordination = new ResearchCoordination();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(prelude, researchCoordination);
        player.corporationCard = corpo;
        const action = card.play(player);
        expect(action).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints("victoryPoints", card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    });
});