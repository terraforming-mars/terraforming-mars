
import { expect } from "chai";
import { Insulation } from "../../src/cards/Insulation";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from "../../src/Resources";

describe("Insulation", function () {
    it("Should play", function () {
        const card = new Insulation();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.addProduction(Resources.HEAT);
        const action = card.play(player, game);
        expect(action).is.not.undefined;
        if (action === undefined) return;
        action.cb(1);
        expect(player.getProduction(Resources.HEAT)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});
