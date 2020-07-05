import { expect } from "chai";
import { TectonicStressPower } from "../../src/cards/TectonicStressPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { SearchForLife } from "../../src/cards/SearchForLife";
import { Resources } from '../../src/Resources';

describe("TectonicStressPower", function () {
    let card : TectonicStressPower, player : Player;

    beforeEach(function() {
        card = new TectonicStressPower();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new SearchForLife(), new SearchForLife());
        expect(card.canPlay(player)).to.eq(true);
        card.play(player);

        expect(player.getProduction(Resources.ENERGY)).to.eq(3);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
