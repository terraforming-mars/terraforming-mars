
import { expect } from "chai";
import { AquiferPumping } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("AquiferPumping", function () {
    it("Should play", function () {
        const card = new AquiferPumping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.play(player, game)).to.eq(undefined);
    });
    it("Should action", function () {
        const card = new AquiferPumping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        const expectedOceanSpace = game.getAvailableSpacesForOcean(player)[0];
        player.megaCredits = 8;
        action.options[0].cb(expectedOceanSpace);
        action.options[1].cb({
            heat: 0,
            steel: 0,
            titanium: 0,
            megaCredits: 8
        });
        action.cb();
        expect(player.megaCredits).to.eq(0);
        expect(expectedOceanSpace.player).to.eq(undefined);
        expect(expectedOceanSpace.tile).not.to.eq(undefined);
        expect(expectedOceanSpace.tile && expectedOceanSpace.tile.tileType).to.eq(TileType.OCEAN);
        action.options[1].cb({
            heat: 0,
            steel: 0,
            titanium: 0,
            megaCredits: 7
        });
        expect(function () { action.cb(); }).to.throw("Need to pay 8");
    });
});
