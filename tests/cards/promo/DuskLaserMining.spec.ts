import { expect } from "chai";
import { DuskLaserMining } from "../../../src/cards/promo/DuskLaserMining";
import { AdvancedAlloys } from "../../../src/cards/AdvancedAlloys";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("DuskLaserMining", function () {
    it("Can't play if not enough science tags available", function () {
        const card = new DuskLaserMining();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Can't play if no heat production", function () {
        const card = new DuskLaserMining();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new AdvancedAlloys());
        player.playedCards.push(new AdvancedAlloys());
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new DuskLaserMining();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new AdvancedAlloys());
        player.playedCards.push(new AdvancedAlloys());
        player.setProduction(Resources.ENERGY, 2);
        const play = card.play(player);
        expect(play).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.titanium).to.eq(4);
    });
});
