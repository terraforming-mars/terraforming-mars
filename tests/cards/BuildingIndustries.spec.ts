
import { expect } from "chai";
import { BuildingIndustries } from "../../src/cards/BuildingIndustries";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("BuildingIndustries", function () {
    it("Should throw", function () {
        const card = new BuildingIndustries();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have energy production");
    });
    it("Should play", function () {
        const card = new BuildingIndustries();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energyProduction = 1;
        card.play(player, game);
        expect(player.energyProduction).to.eq(0);
        expect(player.steelProduction).to.eq(2);
    });
});
