import { expect } from "chai";
import { SaturnSurfing } from "../../../src/cards/promo/SaturnSurfing";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Sponsors } from "../../../src/cards/Sponsors";
import { EarthOffice } from "../../../src/cards/EarthOffice";
import { Resources } from "../../../src/Resources";

describe("SaturnSurfing", function () {
    it("Should play", function () {
        const card = new SaturnSurfing();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new Sponsors());
        player.playedCards.push(new EarthOffice());
        expect(card.play(player)).to.eq(undefined);
        expect(card.resourceCount).to.eq(3);
    });
    it("Can't act if no floaters on the card", function () {
        const card = new SaturnSurfing();
        const player = new Player("test", Color.BLUE, false);
        expect(card.play(player)).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
        card.resourceCount = 0;
        expect(card.canAct()).to.eq(false);
    });
    it("Can act", function () {
        const card = new SaturnSurfing();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new Sponsors());
        player.playedCards.push(new EarthOffice());
        expect(card.play(player)).to.eq(undefined);
        expect(card.resourceCount).to.eq(3);
        expect(card.canAct()).to.eq(true);
        expect(card.action(player)).to.eq(undefined);
        expect(card.resourceCount).to.eq(2);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(3)
    });
    it("Should give victory points", function () {
        const card = new SaturnSurfing();
        const player = new Player("test", Color.BLUE, false);
        expect(card.play(player)).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});