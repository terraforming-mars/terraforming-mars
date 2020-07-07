import { expect } from "chai";
import { SaturnSurfing } from "../../../src/cards/promo/SaturnSurfing";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Sponsors } from "../../../src/cards/Sponsors";
import { EarthOffice } from "../../../src/cards/EarthOffice";
import { Resources } from "../../../src/Resources";

describe("SaturnSurfing", function () {
    let card : SaturnSurfing, player : Player;

    beforeEach(function() {
        card = new SaturnSurfing();
        player = new Player("test", Color.BLUE, false);
    });

    it("Should play", function () {
        player.playedCards.push(new Sponsors());
        player.playedCards.push(new EarthOffice());
        card.play(player);
        expect(card.resourceCount).to.eq(3);
    });

    it("Can't act if no floaters on the card", function () {
        card.play(player);
        expect(card.resourceCount).to.eq(1);

        card.resourceCount = 0;
        expect(card.canAct()).to.eq(false);
    });

    it("Can act", function () {
        player.playedCards.push(new Sponsors());
        player.playedCards.push(new EarthOffice());
        card.play(player);
        expect(card.resourceCount).to.eq(3);

        expect(card.canAct()).to.eq(true);
        card.action(player);
        expect(card.resourceCount).to.eq(2);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
    });

    it("Should give victory points", function () {
        card.play(player);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});