import { expect } from "chai";
import { InterplanetaryTrade } from "../../../src/cards/promo/InterplanetaryTrade";
import { SpaceElevator } from "../../../src/cards/SpaceElevator";
import { AdvancedAlloys } from "../../../src/cards/AdvancedAlloys";
import { MarsUniversity } from "../../../src/cards/MarsUniversity";
import { ResearchCoordination } from "../../../src/cards/prelude/ResearchCoordination";
import { AdvancedEcosystems } from "../../../src/cards/AdvancedEcosystems";
import { MaxwellBase } from "../../../src/cards/venusNext/MaxwellBase";
import { LunarBeam } from "../../../src/cards/LunarBeam";
import { ColonizerTrainingCamp } from "../../../src/cards/ColonizerTrainingCamp";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("InterplanetaryTrade", function () {
    it("Should play", function () {
        const card = new InterplanetaryTrade();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new AdvancedAlloys());
        player.playedCards.push(new SpaceElevator());
        player.playedCards.push(new MarsUniversity());
        player.playedCards.push(new ResearchCoordination());
        const play = card.play(player);
        expect(play).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    });
    it("Should only count wildcards up to the max amount of tag types existing", function () {
        const card = new InterplanetaryTrade();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new AdvancedAlloys());
        player.playedCards.push(new SpaceElevator());
        player.playedCards.push(new MarsUniversity());
        player.playedCards.push(new ResearchCoordination());
        player.playedCards.push(new AdvancedEcosystems());
        player.playedCards.push(new MaxwellBase());
        player.playedCards.push(new LunarBeam());
        player.playedCards.push(new ColonizerTrainingCamp());
        const play = card.play(player);
        expect(play).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(11);
    });
    it("Should give victory points", function () {
        const card = new InterplanetaryTrade();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play(player);
        expect(play).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
    it("Should raise MC production by one", function () {
        const card = new InterplanetaryTrade();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play(player);
        expect(play).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});