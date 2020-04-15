
import { expect } from "chai";
import { GiantSolarShade } from "../../../src/cards/venusNext/GiantSolarShade";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("GiantSolarShade", function () {
    it("Should play", function () {
        const card = new GiantSolarShade();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.getVenusScaleLevel()).to.eq(6);
        expect(player.getTerraformRating()).to.eq(23);
    });
});