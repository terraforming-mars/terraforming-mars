import { expect } from "chai";
import { SulphurExports } from "../../../src/cards/venusNext/SulphurExports";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from "../../../src/Game";

describe("SulphurExports", function () {
    it("Should play", function () {
        const card = new SulphurExports();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});