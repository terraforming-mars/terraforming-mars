import { expect } from "chai";
import { DuskLaserMining } from "../../../src/cards/promo/DuskLaserMining";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Research } from "../../../src/cards/Research";

describe("DuskLaserMining", function () {
    let card : DuskLaserMining, player : Player;

    beforeEach(function() {
        card = new DuskLaserMining();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play if not enough science tags", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Can't play if no energy production", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new Research());
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.titanium).to.eq(4);
    });
});
