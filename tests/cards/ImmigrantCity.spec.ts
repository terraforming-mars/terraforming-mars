
import { expect } from "chai";
import { ImmigrantCity } from "../../src/cards/ImmigrantCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ImmigrantCity", function () {
    it("Should throw", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have energy production");
    });
    it("Should play", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(1);
        game.addCityTile(player, game.getAvailableSpacesOnLand(player)[0].id);
        expect(player.megaCreditProduction).to.eq(2);
    });
});
