
import { expect } from "chai";
import { TectonicStressPower } from "../../src/cards/TectonicStressPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { SearchForLife } from "../../src/cards/SearchForLife";
import { Resources } from '../../src/Resources';

describe("TectonicStressPower", function () {
    it("Should throw", function () {
        const card = new TectonicStressPower();
        const player = new Player("test", Color.BLUE, false);
        expect(function () { card.play(player); }).to.throw("Requires 2 science tags");
    });
    it("Should play", function () {
        const card = new TectonicStressPower();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new SearchForLife(), new SearchForLife());
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(3);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});
