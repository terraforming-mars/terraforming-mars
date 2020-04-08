import { expect } from "chai";
import { OrbitalCleanup } from "../../../src/cards/promo/OrbitalCleanup";
import { AdvancedAlloys } from "../../../src/cards/AdvancedAlloys";
import { Research } from "../../../src/cards/Research"
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { ResearchCoordination } from "../../../src/cards/prelude/ResearchCoordination";

describe("OrbitalCleanup", function () {
    it("Can't play if not enough MC available", function () {
        const card = new OrbitalCleanup();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.MEGACREDITS, -4);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new OrbitalCleanup();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(true);
        expect(card.play(player)).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
    });
    it("Should act", function () {
        const card = new OrbitalCleanup();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new Research());
        player.playedCards.push(new AdvancedAlloys());
        player.playedCards.push(new ResearchCoordination());
        expect(card.play(player)).to.eq(undefined);
        expect(card.action(player)).to.eq(undefined);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(4);
    });
    it("Should give victory points", function () {
        const card = new OrbitalCleanup();
        const player = new Player("test", Color.BLUE, false);
        expect(card.play(player)).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});