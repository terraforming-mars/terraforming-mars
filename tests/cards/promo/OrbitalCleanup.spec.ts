import { expect } from "chai";
import { OrbitalCleanup } from "../../../src/cards/promo/OrbitalCleanup";
import { AdvancedAlloys } from "../../../src/cards/AdvancedAlloys";
import { Research } from "../../../src/cards/Research"
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { ResearchCoordination } from "../../../src/cards/prelude/ResearchCoordination";

describe("OrbitalCleanup", function () {
    let card : OrbitalCleanup, player : Player;

    beforeEach(function() {
        card = new OrbitalCleanup();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play if cannot decrease MC production", function () {
        player.setProduction(Resources.MEGACREDITS, -4);
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        expect(card.canPlay(player)).to.eq(true);
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
    });

    it("Should act", function () {
        player.playedCards.push(new Research());
        player.playedCards.push(new AdvancedAlloys());
        player.playedCards.push(new ResearchCoordination());
        
        card.action(player);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(4);
    });

    it("Should give victory points", function () {
        card.play(player);
        expect(card.getVictoryPoints()).to.eq(2);
    });
});