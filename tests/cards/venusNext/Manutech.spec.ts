import { expect } from "chai";
import { Manutech } from "../../../src/cards/venusNext/Manutech";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("Manutech", function () {
    it("Should play", function () {
        const card = new Manutech();
        const player = new Player("test", Color.BLUE, false);
        player.corporationCard = card;
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(player.steel).to.eq(1);
    });
});