import { expect } from "chai";
import { OrbitalReflectors } from "../../../src/cards/venusNext/OrbitalReflectors";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("OrbitalReflectors", function () {
    it("Should play", function () {
        const card = new OrbitalReflectors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(game.getVenusScaleLevel()).to.eq(4);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
    });
});