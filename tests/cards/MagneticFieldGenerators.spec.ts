
import { expect } from "chai";
import { MagneticFieldGenerators } from "../../src/cards/MagneticFieldGenerators";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("MagneticFieldGenerators", function () {
    it("Should throw", function () {
        const card = new MagneticFieldGenerators();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have 4 energy production");
    });
    it("Should play", function () {
        const card = new MagneticFieldGenerators();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energyProduction = 4;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(0);
        expect(player.plantProduction).to.eq(2);
        expect(player.terraformRating).to.eq(17);
    });
});
