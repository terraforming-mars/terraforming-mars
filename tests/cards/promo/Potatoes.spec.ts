import { expect } from "chai";
import { Potatoes } from "../../../src/cards/promo/Potatoes";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';
import { ViralEnhancers } from "../../../src/cards/ViralEnhancers";

describe("Potatoes", function () {
    it("Can't play", function () {
        const card = new Potatoes();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Can play with 1 plant if have Viral Enhancers", function () {
        const card = new Potatoes();
        const viralEnhancers = new ViralEnhancers();
        const player = new Player("test", Color.BLUE, false);

        player.plants = 1;
        player.playedCards.push(viralEnhancers);
        expect(card.canPlay(player)).to.eq(true);
    });
    it("Should play", function () {
        const card = new Potatoes();
        const player = new Player("test", Color.BLUE, false);

        player.plants = 2;
        expect(card.canPlay(player)).to.eq(true);
        
        card.play(player);
        expect(player.plants).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});
