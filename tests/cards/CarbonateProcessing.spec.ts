
import { expect } from "chai";
import { CarbonateProcessing } from "../../src/cards/CarbonateProcessing";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("CarbonateProcessing", function () {
    it("Can't play", function () {
        const card = new CarbonateProcessing();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () { 
        const card = new CarbonateProcessing();
        const player = new Player("test", Color.BLUE, false);
        player.energyProduction = 1;
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(0);
        expect(player.getProduction(Resources.HEAT)).to.eq(3);
    });
});
